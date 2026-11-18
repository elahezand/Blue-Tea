import type { Types } from "mongoose"
import { clearCache } from "../middlewares/cache.js"
import { fileUrl } from "../middlewares/upload.js"
import Category, { CATEGORY_TYPES, type CategoryType, type ICategory } from "../models/Category.js"
import MenuItem from "../models/MenuItem.js"
import Product from "../models/Product.js"
import type { CategoryBody, UpdateCategoryBody } from "../schemas/category.schema.js"
import type { AdminListQuery } from "../schemas/common.schema.js"
import { AppError } from "../utils/AppError.js"
import { buildListQuery } from "../utils/buildListQuery.js"
import { removeUpload } from "../utils/files.js"
import { paginate } from "../utils/paginate.js"

const FOLDER = "categories"

export interface CategoryNode {
    _id: Types.ObjectId
    name: string
    slug: string
    img?: string
    children: CategoryNode[]
}

/* ---------- Public ---------- */

export const getTree = async (type: "shop" | "menu" = "shop") => {
    const categories = await Category.find({ type }).sort({ name: 1 }).lean()

    const nodes = new Map<string, CategoryNode>()
    for (const { _id, name, slug, img } of categories) {
        nodes.set(String(_id), { _id, name, slug, img, children: [] })
    }

    const roots: CategoryNode[] = []
    for (const category of categories) {
        const node = nodes.get(String(category._id))!
        const parent = category.parentId ? nodes.get(String(category.parentId)) : undefined
        if (parent) parent.children.push(node)
        else roots.push(node)
    }
    return roots
}

/* ---------- Admin ---------- */

const ADMIN_SORTS: Record<string, Record<string, 1 | -1>> = {
    latest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    name: { name: 1 },
}

const makeSlug = async (text: string, type: CategoryType, excludeId?: string) => {
    const base = text
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60) || "category"

    let slug = base
    for (let i = 2; await Category.exists({ type, slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) }); i++) {
        slug = `${base}-${i}`
    }
    return slug
}

const findOr404 = async (id: string) => {
    const category = await Category.findById(id)
    if (!category) throw new AppError("Category not found", 404)
    return category
}

const isUsed = async (id: string, type: CategoryType) =>
    !!(type === "menu" ? await MenuItem.exists({ category: id }) : await Product.exists({ category: id }))

export const listAdmin = ({ limit, cursor, sort, type, ...query }: AdminListQuery) =>
    paginate(Category, {
        limit,
        cursor,
        filters: buildListQuery<ICategory>(query, {
            search: ["name", "slug"],
            extra: type && CATEGORY_TYPES.includes(type as CategoryType) ? { type } : undefined,
        }),
        sort: ADMIN_SORTS[sort ?? "latest"] ?? ADMIN_SORTS.latest,
        populate: { path: "parentId", select: "name" },
    })

export const getById = async (id: string) => {
    const category = await Category.findById(id).populate("parentId", "name").lean()
    if (!category) throw new AppError("Category not found", 404)
    return category
}

export const create = async (body: CategoryBody, file?: Express.Multer.File) => {
    const img = fileUrl(FOLDER, file)
    try {
        const category = await Category.create({
            ...body,
            slug: await makeSlug(body.slug || body.name, body.type),
            parentId: body.parentId ?? null,
            img,
        })
        await clearCache("categories", "menu", "products")
        return category
    } catch (error) {
        await removeUpload(img)
        throw error
    }
}

export const update = async (id: string, body: UpdateCategoryBody, file?: Express.Multer.File) => {
    const newImg = fileUrl(FOLDER, file)
    try {
        const category = await findOr404(id)
        const oldImg = category.img
        const type = body.type ?? category.type
        const typeChanged = type !== category.type

        if (typeChanged && (await isUsed(id, category.type))) {
            throw new AppError("This category is in use, its type can not change", 409, { type: "This category is in use" })
        }

        const slugSource = body.slug || (body.name !== undefined && body.name !== category.name ? body.name : undefined)
        category.set({ ...body, parentId: body.parentId === undefined ? category.parentId : body.parentId ?? null })
        if (slugSource || typeChanged) category.slug = await makeSlug(slugSource || category.slug, type, id)
        if (newImg) category.img = newImg

        await category.save()
        if (newImg) await removeUpload(oldImg)
        await clearCache("categories", "menu", "products")
        return category
    } catch (error) {
        await removeUpload(newImg)
        throw error
    }
}

export const remove = async (id: string) => {
    const category = await findOr404(id)

    if (await Category.exists({ parentId: id })) {
        throw new AppError("Move or delete its sub categories first", 409)
    }
    if (await isUsed(id, category.type)) {
        throw new AppError(`This category still has ${category.type === "menu" ? "menu items" : "products"}`, 409)
    }

    await category.deleteOne()
    await removeUpload(category.img)
    await clearCache("categories", "menu", "products")
}