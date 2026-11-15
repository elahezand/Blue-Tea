import { Router } from "express"
import Ticket from "../models/Ticket.js"
import { requireAuth } from "../middlewares/auth.js"
import { asyncHandler, send } from "../utils/http.js"

const router = Router()

// GET /tickets/me -> the user's tickets, last updated first
router.get("/me", requireAuth, asyncHandler(async (req, res) => {
    send(res, await Ticket.find({ user: req.user._id }).sort({ updatedAt: -1 }))
}))

export default router
