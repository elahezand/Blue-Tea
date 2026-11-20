import Category from "../models/Category.js"
import MenuItem from "../models/MenuItem.js"
import type { AdminListQuery } from "../schemas/common.schema.js"
import type { MenuItemBody, UpdateMenuItemBody } from "../schemas/menu.schema.js"
import { AppError } from "../utils/AppError.js"

const todo = (): never => {
    throw new AppError("Not implemented yet", 501)
}

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

export const listAdmin = async (_query: AdminListQuery) => todo()
export const create = async (_body: MenuItemBody, _file?: Express.Multer.File) => todo()
export const update = async (_id: string, _body: UpdateMenuItemBody, _file?: Express.Multer.File) => todo()
export const remove = async (_id: string) => todo()
