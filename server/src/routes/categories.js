import { Router } from "express"
import Category from "../models/Category.js"
import { asyncHandler, send } from "../utils/http.js"

const router = Router()

// Older data uses parentId, new data uses parent: both work
export const parentOf = (c) => c.parent ?? c.parentId ?? null

/** flat list -> tree: [{ _id, name, img, children: [...] }] */
export const buildTree = (categories, parent = null) =>
    categories
        .filter((c) => String(parentOf(c)) === String(parent))
        .map((c) => ({ _id: c._id, name: c.name, img: c.img, children: buildTree(categories, c._id) }))

/** the id of a category and of everything under it (for "show all Tea" with its sub categories) */
export const withChildren = (categories, id) => [
    id,
    ...categories.filter((c) => String(parentOf(c)) === String(id)).flatMap((c) => withChildren(categories, c._id)),
]

/** The root of the café menu (slug "menu"): its children are the menu sections, not store categories */
export const isMenuRoot = (c) => !parentOf(c) && c.slug === "menu"

// GET /categories/tree -> the store categories (without the café menu)
router.get("/tree", asyncHandler(async (req, res) => {
    const categories = await Category.find().sort({ _id: 1 }).lean()
    send(res, buildTree(categories).filter((root) => !isMenuRoot(categories.find((c) => String(c._id) === String(root._id)))))
}))

export default router
