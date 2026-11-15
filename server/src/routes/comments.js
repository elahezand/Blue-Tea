import { Router } from "express"
import Comment from "../models/Comment.js"
import { asyncHandler, send } from "../utils/http.js"

const router = Router()

// GET /comments/latest?limit -> newest accepted reviews (home page)
router.get("/latest", asyncHandler(async (req, res) => {
    const limit = Math.min(Number(req.query.limit) || 10, 30)
    send(res, await Comment.find({ isAccept: true }).sort({ date: -1 }).limit(limit))
}))

export default router
