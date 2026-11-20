import type { FilterQuery } from "mongoose"
import { clearCache } from "../middlewares/cache.js"
import { fileUrl } from "../middlewares/upload.js"
import Category from "../models/Category.js"
import MenuItem, { type IMenuItem } from "../models/MenuItem.js"
import type { AdminListQuery } from "../schemas/common.schema.js"
import type { MenuItemBody, UpdateMenuItemBody } from "../schemas/menu.schema.js"
import { AppError } from "../utils/AppError.js"
import { buildListQuery } from "../utils/buildListQuery.js"
import { removeUpload } from "../utils/files.js"
import { paginate } from "../utils/paginate.js"

const FOLDER = "menu"

/* ---------- Public ---------- */
export const getMenu = async () => {
    const [sections, items] = await Promise.all([
        Category.find({ type: "menu" }).sort({ name: 1 }).select("name").lean(),
        MenuItem.find({ isAvailable: true }).sort({ name: 1 }).select("name description price size img category").lean(),
    ])

    return sections
        .map((section) => ({
            _id: section._id,
            name: section.name,
            items: items
                .filter((item) => String(item.category) === String(section._id))
                .map(({ category: _category, ...item }) => item),
        }))
        .filter((section) => section.items.length > 0)
}

/* ---------- Admin ---------- */

const ADMIN_SORTS: Record<string, Record<string, 1 | -1>> = {
    latest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    name: { name: 1 },
    "price-asc": { price: 1 },
    "price-desc": { price: -1 },
}

const findOr404 = async (id: string) => {
    const item = await MenuItem.findById(id)
    if (!item) throw new AppError("Menu item not found", 404)
    return item
}

const assertMenuSection = async (id: string) => {
    if (!(await Category.exists({ _id: id, type: "menu" }))) {
        throw new AppError("Pick a menu section", 422, { category: "Pick a menu section" })
    }
}

const adminFilters = (min?: number, max?: number, available?: boolean): FilterQuery<IMenuItem> => ({
    ...(available !== undefined ? { isAvailable: available } : {}),
    ...(min !== undefined || max !== undefined
        ? { price: { ...(min !== undefined ? { $gte: min } : {}), ...(max !== undefined ? { $lte: max } : {}) } }
        : {}),
})

export const listAdmin = async ({ limit, cursor, sort, min, max, available, ...query }: AdminListQuery) =>
    paginate(MenuItem, {
        limit,
        cursor,
        filters: buildListQuery<IMenuItem>(query, {
            search: ["name", "description"],
            ids: { category: "category" },
            extra: adminFilters(min, max, available),
        }),
        sort: ADMIN_SORTS[sort ?? "latest"] ?? ADMIN_SORTS.latest,
        populate: { path: "category", select: "name" },
    })

export const getById = async (id: string) => {
    const item = await MenuItem.findById(id).populate("category", "name").lean()
    if (!item) throw new AppError("Menu item not found", 404)
    return item
}

export const create = async (body: MenuItemBody, file?: Express.Multer.File) => {
    const img = fileUrl(FOLDER, file)
    try {
        await assertMenuSection(body.category)
        const item = await MenuItem.create({ ...body, img })
        await clearCache("menu")
        return item
    } catch (error) {
        await removeUpload(img)
        throw error
    }
}

export const update = async (id: string, body: UpdateMenuItemBody, file?: Express.Multer.File) => {
    const newImg = fileUrl(FOLDER, file)
    try {
        const item = await findOr404(id)
        if (body.category) await assertMenuSection(body.category)

        const oldImg = item.img
        item.set(body)
        if (newImg) item.img = newImg
        await item.save()

        if (newImg) await removeUpload(oldImg)
        await clearCache("menu")
        return item
    } catch (error) {
        await removeUpload(newImg)
        throw error
    }
}

export const remove = async (id: string) => {
    const item = await MenuItem.findByIdAndDelete(id)
    if (!item) throw new AppError("Menu item not found", 404)
    await removeUpload(item.img)
    await clearCache("menu")
}