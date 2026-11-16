import "../types/express.js"
import type { Request, RequestHandler } from "express"
import redis from "../config/redis.js"
import { AppError } from "../utils/AppError.js"

interface RateLimitOptions {
    name: string
    max: number
    windowSec: number
    key?: (req: Request) => string | undefined
    message?: string
}

export const byIp = (req: Request) => req.ip ?? "unknown"
export const byPhone = (req: Request) => (typeof req.body?.phone === "string" ? req.body.phone.replace(/[\s().-]/g, "") : undefined)
export const byUser = (req: Request) => req.user?._id.toString() ?? req.ip

export const rateLimit = ({ name, max, windowSec, key = byIp, message = "Too many requests. Please try again later." }: RateLimitOptions): RequestHandler =>
    async (req, res, next) => {
        const id = key(req)
        if (!id) return next()
        const redisKey = `rl:${name}:${id}`
        try {
            const count = await redis.incr(redisKey)
            if (count === 1) await redis.expire(redisKey, windowSec)
            if (count > max) {
                const ttl = await redis.ttl(redisKey)
                res.setHeader("Retry-After", String(Math.max(ttl, 1)))
                return next(new AppError(message, 429))
            }
        } catch {
            return next()
        }
        next()
    }
