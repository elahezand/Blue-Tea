import { Router } from "express"
import User from "../models/User.js"
import { ADMIN_PHONE, IS_DEV } from "../config/env.js"
import { asyncHandler, httpError, isPhone, send, sendMessage, validate } from "../utils/http.js"
import { REFRESH_COOKIE, clearAuthCookies, setAuthCookies, verifyRefresh } from "../utils/tokens.js"

const router = Router()

// Login codes, kept in memory (they are lost when the server restarts, fine for now).
// There is no SMS service yet: the code is printed in the terminal (and sent back in dev).
const codes = new Map() // phone -> { code, expiresAt, sentAt }
const CODE_TTL = 2 * 60 * 1000 // a code works for 2 minutes
const RESEND_AFTER = 60 * 1000  // a new code only after 60 seconds (same as the frontend timer)

// POST /auth/send-code { phone }
router.post("/send-code", asyncHandler(async (req, res) => {
    validate(req.body, { phone: (v) => (isPhone(v) ? undefined : "Enter your number with the country code, for example +14155550123") })
    const { phone } = req.body

    const last = codes.get(phone)
    if (last && Date.now() - last.sentAt < RESEND_AFTER) {
        throw httpError(429, "Please wait a minute before asking for a new code")
    }

    const code = String(Math.floor(1000 + Math.random() * 9000)) // 4 digits
    codes.set(phone, { code, expiresAt: Date.now() + CODE_TTL, sentAt: Date.now() })
    console.log(`\n  Login code for ${phone}: ${code}\n`)

    sendMessage(res, "Code sent", 200, IS_DEV ? { code } : null) // dev: the code comes back too
}))

// POST /auth/verify-code { phone, code } -> cookies + { user }. A new number signs up here.
router.post("/verify-code", asyncHandler(async (req, res) => {
    const { phone, code } = req.body || {}
    const saved = codes.get(phone)
    if (!saved || saved.expiresAt < Date.now()) throw httpError(400, "The code has expired. Ask for a new one.")
    if (saved.code !== String(code).trim()) throw httpError(400, "The code is not correct")
    codes.delete(phone)

    let user = await User.findOne({ phone })
    if (!user) user = await User.create({ phone, name: "" })
    if (user.isBanned) throw httpError(403, "Your account is banned. Please contact us.")
    if (ADMIN_PHONE && phone === ADMIN_PHONE && user.role !== "ADMIN") {
        user.role = "ADMIN"
        await user.save()
    }

    setAuthCookies(res, user)
    send(res, user)
}))

// POST /auth/refresh -> new cookies from the refresh token (called by the frontend interceptor on 401)
router.post("/refresh", asyncHandler(async (req, res) => {
    const token = req.cookies?.[REFRESH_COOKIE]
    if (!token) throw httpError(401, "Please log in")
    let id
    try {
        id = verifyRefresh(token).id
    } catch {
        throw httpError(401, "Your session has expired")
    }
    const user = await User.findById(id)
    if (!user) throw httpError(401, "Please log in")
    if (user.isBanned) {
        clearAuthCookies(res)
        throw httpError(403, "Your account is banned. Please contact us.")
    }

    setAuthCookies(res, user)
    sendMessage(res, "Session renewed")
}))

// POST /auth/signout
router.post("/signout", (req, res) => {
    clearAuthCookies(res)
    sendMessage(res, "Signed out")
})

export default router
