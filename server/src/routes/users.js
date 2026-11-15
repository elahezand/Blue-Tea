import { Router } from "express"
import User from "../models/User.js"
import Cart from "../models/Cart.js"
import Wishlist from "../models/Wishlist.js"
import { requireAdmin, requireAuth } from "../middlewares/auth.js"
import { paginatePages } from "../utils/paginate.js"
import { asyncHandler, escapeRegex, httpError, isEmail, isObjectId, send, sendList, sendMessage, validate } from "../utils/http.js"

const router = Router()
router.use(requireAuth)

// ---------- the logged-in user ----------

// GET /users/profile
router.get("/profile", (req, res) => send(res, req.user))

// PATCH /users/profile { name, email } (the phone is the login, it is not changed here)
router.patch("/profile", asyncHandler(async (req, res) => {
    validate(req.body, {
        name: (v) => (String(v || "").trim().length >= 3 ? undefined : "Name must be at least 3 characters"),
        email: (v) => (!v || isEmail(v) ? undefined : "Invalid email format"),
    })
    req.user.name = String(req.body.name).trim()
    req.user.email = String(req.body.email || "").trim()
    await req.user.save()
    send(res, req.user)
}))

// ---------- admin ----------

/** ?q (name / phone / email) &role -> mongo filter */
const userFilter = ({ q, role }) => {
    const filter = {}
    if (q) {
        const text = { $regex: escapeRegex(String(q).slice(0, 60)), $options: "i" }
        filter.$or = [{ name: text }, { phone: text }, { email: text }]
    }
    if (role === "ADMIN" || role === "USER") filter.role = role
    return filter
}

// GET /users?page&limit&q&role -> { data, totalCount, pageCount, page, limit }
router.get("/", requireAdmin, asyncHandler(async (req, res) => {
    sendList(res, await paginatePages(User, userFilter(req.query), req.query, { createdAt: -1 }))
}))

// GET /users/banned?page&limit&q -> only banned users
router.get("/banned", requireAdmin, asyncHandler(async (req, res) => {
    sendList(res, await paginatePages(User, { ...userFilter(req.query), isBanned: true }, req.query, { bannedAt: -1 }))
}))

/** the user an admin works on; an admin can not do it to themselves */
const targetUser = async (req) => {
    const { id } = req.params
    if (!isObjectId(id)) throw httpError(404, "User not found")
    if (String(id) === String(req.user._id)) throw httpError(400, "You can not do this to your own account")
    const user = await User.findById(id)
    if (!user) throw httpError(404, "User not found")
    return user
}

// PATCH /users/ban/:id -> can not log in or use the site any more
router.patch("/ban/:id", requireAdmin, asyncHandler(async (req, res) => {
    const user = await targetUser(req)
    if (user.role === "ADMIN") throw httpError(400, "An admin can not be banned")
    user.isBanned = true
    user.bannedAt = new Date()
    await user.save()
    send(res, user)
}))

// PATCH /users/unban/:id
router.patch("/unban/:id", requireAdmin, asyncHandler(async (req, res) => {
    const user = await targetUser(req)
    user.isBanned = false
    user.bannedAt = null
    await user.save()
    send(res, user)
}))

// DELETE /users/:id -> the user with their cart and favorites
router.delete("/:id", requireAdmin, asyncHandler(async (req, res) => {
    const user = await targetUser(req)
    await Promise.all([Cart.deleteOne({ user: user._id }), Wishlist.deleteOne({ user: user._id }), user.deleteOne()])
    sendMessage(res, "User deleted")
}))

export default router
