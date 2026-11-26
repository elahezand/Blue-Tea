import type { FilterQuery } from "mongoose"
import { clearCache } from "../middlewares/cache.js"
import { fileUrl } from "../middlewares/upload.js"
import Category from "../models/Category.js"
import Product, { type IProduct } from "../models/Product.js"
import type { AdminProductQuery, ProductBody, ProductQuery, UpdateProductBody } from "../schemas/product.schema.js"
import { AppError } from "../utils/AppError.js"
import { buildListQuery, escapeRegex } from "../utils/buildListQuery.js"
import { removeUpload } from "../utils/files.js"
import { paginate } from "../utils/paginate.js"
import { countView } from "./view.service.js"

const FOLDER = "products"

const SORTS: Record<string, Record<string, 1 | -1>> = {
    latest: { createdAt: -1 },
    "price-asc": { price: 1 },
    "price-desc": { price: -1 },
    rating: { score: -1 },
    popular: { sold: -1 },
}

type ProductDoc = IProduct & { _id: unknown }

export const toPublic = ({ metadata, ...product }: ProductDoc) => ({
    ...product,
    origin: metadata?.origin,
    notes: metadata?.notes ?? [],
    brewTemp: metadata?.brewTemp,
    brewTime: metadata?.brewTime,
    brewAmount: metadata?.brewAmount,
    variants: (product.variants ?? []).map((variant) => `${variant.grams}g`),
})

const priceFilter = (min?: number, max?: number): FilterQuery<IProduct> => {
    if (min === undefined && max === undefined) return {}
    return { price: { ...(min !== undefined ? { $gte: min } : {}), ...(max !== undefined ? { $lte: max } : {}) } }
}

const getDescendantIds = async (id: string) => {
    const categories = await Category.find({ type: "shop" }).select("_id parentId").lean()
    const children = new Map<string, string[]>()
    for (const { _id, parentId } of categories) {
        if (!parentId) continue
        const key = String(parentId)
        children.set(key, [...(children.get(key) ?? []), String(_id)])
    }

    const ids = [id]
    for (let i = 0; i < ids.length; i++) ids.push(...(children.get(ids[i]) ?? []))
    return ids
}

const findCategoryIds = async (slug: string) => {
    const category = await Category.findOne({ type: "shop", slug }).select("_id").lean()
    return category ? getDescendantIds(String(category._id)) : []
}

export const list = async ({ limit, cursor, category, tag, min, max, sort, ...query }: ProductQuery) => {
    const categories = category ? await findCategoryIds(category) : undefined

    const { data, pagination } = await paginate(Product, {
        limit,
        cursor,
        filters: buildListQuery<IProduct>(query, {
            base: { isAvailable: true },
            search: ["name", "tags"],
            extra: {
                ...(categories ? { category: { $in: categories } } : {}),
                ...(tag ? { tags: new RegExp(`^${escapeRegex(tag)}$`, "i") } : {}),
                ...priceFilter(min, max),
            },
        }),
        sort: SORTS[sort ?? "latest"],
        select: "-longDescription",
    })

    return { data: data.map(toPublic), pagination }
}

export const getById = async (id: string) => {
    const product = await Product.findById(id).populate("category", "name slug").lean()
    if (!product) throw new AppError("Product not found", 404)
    return toPublic(product)
}

export const addView = async (id: string, ip: string) => {
    if (!(await Product.exists({ _id: id }))) throw new AppError("Product not found", 404)
    await countView(Product, "product", id, ip)
}

export const listAdmin = async ({
    limit, cursor, category, available, stock, min, max, sort, q, from, to, preset,
}: AdminProductQuery) => {
    const categories = category ? await getDescendantIds(category) : undefined
    const stockFilters: Record<NonNullable<AdminProductQuery["stock"]>, FilterQuery<IProduct>> = {
        "in-stock": { stock: { $gt: 0 } },
        "out-of-stock": { $or: [{ stock: { $lte: 0 } }, { stock: null }] },
    }
    const { data, pagination } = await paginate(Product, {
        limit,
        cursor,
        filters: buildListQuery<IProduct>({ q, from, to, preset }, {
            dateField: "createdAt",
            search: ["name", "tags"],
            extra: {
                ...(categories ? { category: { $in: categories } } : {}),
                ...(available !== undefined ? { isAvailable: available } : {}),
                ...(stock ? stockFilters[stock] : {}),
                ...priceFilter(min, max),
            },
        }),
        sort: SORTS[sort ?? "latest"],
        populate: { path: "category", select: "name slug" },
        select: "-longDescription",
    })

    return { data: data.map(toPublic), pagination }
}
export const getAdminById = getById

const assertShopCategory = async (id: string) => {
    if (!(await Category.exists({ _id: id, type: "shop" }))) {
        throw new AppError("Pick a shop category", 422, { category: "Pick a shop category" })
    }
}

const makeSlug = async (name: string) => {
    const base = name.toLowerCase().normalize("NFKD").replace(/\p{Mark}/gu, "")
        .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "product"
    let slug = base
    for (let suffix = 2; await Product.exists({ slug }); suffix++) slug = `${base}-${suffix}`
    return slug
}

export const create = async (body: ProductBody, file?: Express.Multer.File) => {
    const img = fileUrl(FOLDER, file)
    const { origin, notes, brewTemp, brewTime, brewAmount, variants, ...fields } = body
    let product
    try {
        await assertShopCategory(fields.category)
        product = await Product.create({
            ...fields,
            slug: fields.slug ?? await makeSlug(fields.name),
            variants: variants.map((grams) => ({ grams })),
            metadata: { origin, notes, brewTemp, brewTime, brewAmount },
            img,
        })
    } catch (error) {
        await removeUpload(img)
        throw error
    }
    await clearCache("products")
    return toPublic(product.toObject())
}

export const update = async (id: string, body: UpdateProductBody, file?: Express.Multer.File) => {
    const img = fileUrl(FOLDER, file)
    const { origin, notes, brewTemp, brewTime, brewAmount, variants, ...fields } = body
    const patch: Record<string, unknown> = { ...fields }
    for (const [key, value] of Object.entries({ origin, notes, brewTemp, brewTime, brewAmount })) {
        if (value !== undefined) patch[`metadata.${key}`] = value
    }
    if (variants !== undefined) patch.variants = variants.map((grams) => ({ grams }))
    if (img) patch.img = img

    let previousImg: string | undefined
    let product
    try {
        if (fields.category) await assertShopCategory(fields.category)
        const current = await Product.findById(id).select("img").lean()
        if (!current) throw new AppError("Product not found", 404)
        previousImg = current.img
        const filter = img ? { _id: id, img: previousImg ?? null } : { _id: id }
        product = await Product.findOneAndUpdate(filter, { $set: patch }, { new: true, runValidators: true }).lean()
        if (!product) throw new AppError("Product changed. Reload and try again.", 409)
    } catch (error) {
        await removeUpload(img)
        throw error
    }
    if (img) await removeUpload(previousImg)
    await clearCache("products")
    return toPublic(product)
}

export const remove = async (id: string) => {
    const product = await Product.findByIdAndDelete(id).lean()
    if (!product) throw new AppError("Product not found", 404)
    await removeUpload(product.img)
    await clearCache("products", "comments")
}
