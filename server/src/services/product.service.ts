import type { FilterQuery } from "mongoose"
import Category from "../models/Category.js"
import Product, { type IProduct } from "../models/Product.js"
import type { AdminListQuery } from "../schemas/common.schema.js"
import type { ProductBody, ProductQuery, UpdateProductBody } from "../schemas/product.schema.js"
import { AppError } from "../utils/AppError.js"
import { buildListQuery } from "../utils/buildListQuery.js"
import { paginate } from "../utils/paginate.js"
import { countView } from "./view.service.js"

const todo = (): never => {
    throw new AppError("Not implemented yet", 501)
}

const SORTS: Record<string, Record<string, 1 | -1>> = {
    latest: { createdAt: -1 },
    "price-asc": { price: 1 },
    "price-desc": { price: -1 },
    rating: { score: -1 },
    popular: { sold: -1 },
}

type ProductDoc = IProduct & { _id: unknown }

const toPublic = ({ metadata, ...product }: ProductDoc) => ({
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

export const list = async ({ limit, cursor, category, min, max, sort, ...query }: ProductQuery) => {
    const categories = category ? await findCategoryIds(category) : undefined

    const { data, pagination } = await paginate(Product, {
        limit,
        cursor,
        filters: buildListQuery<IProduct>(query, {
            base: { isAvailable: true },
            search: ["name", "tags"],
            extra: {
                ...(categories ? { category: { $in: categories } } : {}),
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

export const listAdmin = async (_query: AdminListQuery) => todo()
export const getAdminById = async (_id: string) => todo()
export const create = async (_body: ProductBody, _file?: Express.Multer.File) => todo()
export const update = async (_id: string, _body: UpdateProductBody, _file?: Express.Multer.File) => todo()
export const remove = async (_id: string) => todo()