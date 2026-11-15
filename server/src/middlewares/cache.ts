import type { RequestHandler } from "express"
import redis from "../config/redis.js"

const PREFIX = "cache:"

export const cache = (group: string, seconds = 300): RequestHandler => async (req, res, next) => {
    if (req.method !== "GET") return next()
    const key = `${PREFIX}${group}:${req.originalUrl}`

    try {
        const hit = await redis.get(key)
        if (hit) {
            res.setHeader("X-Cache", "HIT")
            res.type("application/json").send(hit)
            return
        }
    } catch {
        return next()
    }

    const json = res.json.bind(res)
    res.json = (body) => {
        if (res.statusCode === 200) redis.set(key, JSON.stringify(body), "EX", seconds).catch(() => undefined)
        res.setHeader("X-Cache", "MISS")
        return json(body)
    }
    next()
}

export const clearCache = async (...groups: string[]) => {
    try {
        for (const group of groups) {
            let cursor = "0"
            do {
                const [next, keys] = await redis.scan(cursor, "MATCH", `${PREFIX}${group}:*`, "COUNT", 100)
                cursor = next
                if (keys.length) await redis.del(...keys)
            } while (cursor !== "0")
        }
    } catch (error) {
        console.error("clear cache failed", error)
    }
}
