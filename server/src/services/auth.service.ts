import { createHash, randomInt, timingSafeEqual } from "node:crypto"
import axios from "axios"
import { ADMIN_PHONE } from "../config/env.js"
import redis from "../config/redis.js"
import Session from "../models/Session.js"
import User from "../models/User.js"
import type { VerifyCodeBody } from "../schemas/auth.schema.js"
import { AppError } from "../utils/AppError.js"
import { REFRESH_TTL_MS } from "../utils/cookies.js"
import { createRefreshToken, hashToken, signAccess } from "../utils/tokens.js"

interface Meta {
    ip: string
    userAgent: string
}

const CODE_TTL_SEC = 2 * 60
const MAX_ATTEMPTS = 5

const otpKey = (phone: string) => `otp:${phone}`
const hashCode = (phone: string, code: string) => createHash("sha256").update(`${phone}:${code}`).digest("hex")

const sameHash = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b))

const redisOrFail = async <T>(action: () => Promise<T>) => {
    try {
        return await action()
    } catch {
        throw new AppError("Login is not available right now. Please try again soon.", 503)
    }
}

const startSession = async (userId: string, meta: Meta) => {
    const refreshToken = createRefreshToken()
    await Session.create({
        user: userId,
        tokenHash: hashToken(refreshToken),
        userAgent: meta.userAgent.slice(0, 300),
        ip: meta.ip,
        expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
    })
    return { accessToken: signAccess(userId), refreshToken }
}

export const sendCode = async (phone: string) => {
    const ttl = await redisOrFail(() => redis.ttl(otpKey(phone)))
    if (ttl > 0) throw new AppError(`Try again after ${ttl} seconds`, 429)

    const code = String(randomInt(100000, 1000000))

    try {
        await axios.post(
            "https://ippanel.com/api/select",
            {
                op: "pattern",
                user: process.env.SMS_USER,
                pass: process.env.SMS_PASS,
                fromNum: "3000505",
                toNum: phone,
                patternCode: process.env.SMS_PATTERN,
                inputData: [{ "verification-code": code }],
            },
            { headers: { "Content-Type": "application/json" } },
        )
    } catch {
        throw new AppError("SMS service failed", 500)
    }

    await redisOrFail(() =>
        redis.multi()
            .hset(otpKey(phone), { hash: hashCode(phone, code), attempts: 0 })
            .expire(otpKey(phone), CODE_TTL_SEC)
            .exec(),
    )
}

export const verifyCode = async ({ phone, code }: VerifyCodeBody, meta: Meta) => {
    const key = otpKey(phone)

    const saved = await redisOrFail(() => redis.hgetall(key))
    if (!saved?.hash) throw new AppError("This code has expired. Ask for a new one.", 400,
        { code: "This code has expired. Ask for a new one." })

    if (!sameHash(saved.hash, hashCode(phone, code))) {
        const attempts = await redisOrFail(() => redis.hincrby(key, "attempts", 1))

        if (attempts >= MAX_ATTEMPTS) await redis.del(key).catch(() => undefined)

        const message = attempts >= MAX_ATTEMPTS ? "Too many wrong codes. Ask for a new one." : "The code is not correct"
        throw new AppError(message, 400, { code: message })
    }

    await redis.del(key).catch(() => undefined)

    let user = await User.findOne({ phone })
    if (!user) user = await User.create({ phone, role: ADMIN_PHONE && phone === ADMIN_PHONE ? "ADMIN" : "USER" })
    if (user.isBanned) throw new AppError("Your account is banned. Please contact us.", 403)

    user.lastLoginAt = new Date()
    await user.save()

    const tokens = await startSession(String(user._id), meta)
    return { user, tokens }
}

export const refresh = async (token: string, meta: Meta) => {
    const tokenHash = hashToken(token)
    const session = await Session.findOne({ tokenHash, revokedAt: null, expiresAt: { $gt: new Date() } })
    if (!session) throw new AppError("Your session has expired", 401)

    const user = await User.findById(session.user).select("isBanned")
    if (!user || user.isBanned) {
        session.revokedAt = new Date()
        await session.save()
        throw new AppError("Your session has expired", 401)
    }

    const refreshToken = createRefreshToken()
    session.tokenHash = hashToken(refreshToken)
    session.lastUsedAt = new Date()
    session.expiresAt = new Date(Date.now() + REFRESH_TTL_MS)
    session.ip = meta.ip
    session.userAgent = meta.userAgent.slice(0, 300)
    await session.save()

    return { accessToken: signAccess(String(user._id)), refreshToken }
}

export const signout = async (token?: string) => {
    if (!token) return
    await Session.updateOne({ tokenHash: hashToken(token), revokedAt: null }, { $set: { revokedAt: new Date() } })
}