import { Router } from "express"
import Article from "../models/Article.js"
import { paginate } from "../utils/paginate.js"
import { asyncHandler, escapeRegex, httpError, isObjectId, send, sendList } from "../utils/http.js"

const router = Router()

// GET /articles?q&limit&cursor -> { data, pagination }
router.get("/", asyncHandler(async (req, res) => {
    const filter = { status: { $ne: "unpublish" } } // older articles may have no status
    if (req.query.q) {
        const q = { $regex: escapeRegex(String(req.query.q).slice(0, 60)), $options: "i" }
        filter.$or = [{ title: q }, { shortDescription: q }]
    }
    sendList(res, await paginate(Article.find(filter).sort({ date: -1, _id: -1 }), req.query))
}))

// GET /articles/:id
router.get("/:id", asyncHandler(async (req, res) => {
    if (!isObjectId(req.params.id)) throw httpError(404, "Article not found")
    const article = await Article.findOne({ _id: req.params.id, status: { $ne: "unpublish" } })
    if (!article) throw httpError(404, "Article not found")
    send(res, article)
}))

export default router
