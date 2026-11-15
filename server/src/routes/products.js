import { Router } from "express"
import Product from "../models/Product.js"
import Category from "../models/Category.js"
import Comment from "../models/Comment.js"
import { paginate } from "../utils/paginate.js"
import { asyncHandler, escapeRegex, httpError, isEmail, isObjectId, send, sendList, sendMessage, validate } from "../utils/http.js"
import { withChildren } from "./categories.js"

const router = Router()

const SORTS = {
    "": { createdAt: -1, _id: -1 },          // featured = newest
    "price-asc": { price: 1, _id: 1 },
    "price-desc": { price: -1, _id: -1 },
    rating: { score: -1, _id: -1 },
}

// GET /products?category&q&min&max&sort&limit&cursor -> { data, pagination }
// The only product list: the store page (filters from its URL) and the home page (?limit=12) both use it.
// All the filtering is done here; the frontend only passes what is in its URL.
router.get("/", asyncHandler(async (req, res) => {
    const { category, q, min, max, sort = "" } = req.query
    const filter = {}

    if (category) {
        const categories = await Category.find().lean()
        const found = categories.find((c) => c.name?.toLowerCase() === String(category).toLowerCase())
        if (!found) return sendList(res, { data: [], pagination: { nextCursor: null, limit: Number(req.query.limit) || 10, hasMore: false } })
        filter.category = { $in: withChildren(categories, found._id) }
    }
    if (q) filter.name = { $regex: escapeRegex(String(q).slice(0, 60)), $options: "i" }
    if (min || max) {
        filter.price = {}
        if (min) filter.price.$gte = Number(min)
        if (max) filter.price.$lte = Number(max)
    }

    sendList(res, await paginate(Product.find(filter).sort(SORTS[sort] || SORTS[""]), req.query))
}))

// GET /products/:id
router.get("/:id", asyncHandler(async (req, res) => {
    if (!isObjectId(req.params.id)) throw httpError(404, "Product not found")
    const product = await Product.findById(req.params.id).populate("category", "name")
    if (!product) throw httpError(404, "Product not found")
    send(res, product)
}))

// GET /products/:id/comments?limit&cursor -> accepted reviews, newest first
router.get("/:id/comments", asyncHandler(async (req, res) => {
    if (!isObjectId(req.params.id)) throw httpError(404, "Product not found")
    const ofProduct = { $or: [{ product: req.params.id }, { productID: req.params.id }] } // older data: productID
    sendList(res, await paginate(Comment.find({ ...ofProduct, isAccept: true }).sort({ date: -1, _id: -1 }), req.query))
}))

// POST /products/:id/comments { username, email, score, body } -> waits for the admin
router.post("/:id/comments", asyncHandler(async (req, res) => {
    if (!isObjectId(req.params.id) || !(await Product.exists({ _id: req.params.id }))) throw httpError(404, "Product not found")
    validate(req.body, {
        username: (v) => (String(v || "").trim().length >= 3 ? undefined : "Name must be at least 3 characters"),
        email: (v) => (isEmail(v) ? undefined : "Invalid email format"),
        score: (v) => (Number(v) >= 1 && Number(v) <= 5 ? undefined : "Pick a rating"),
        body: (v) => (String(v || "").trim().length >= 5 ? undefined : "Your review must be at least 5 characters"),
    })
    const { username, email, score, body } = req.body
    await Comment.create({ product: req.params.id, productID: req.params.id, username, email, score, body, isAccept: false })
    sendMessage(res, "Thanks! Your review will show after we read it.", 201)
}))

export default router
