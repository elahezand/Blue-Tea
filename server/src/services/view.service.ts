import type { Model } from "mongoose"
import redis from "../config/redis.js"

const VIEW_WINDOW_SEC = 60 * 60

export const countView = async <T>(model: Model<T>, kind: string, id: string, ip: string) => {
    try {
        const first = await redis.set(`view:${kind}:${id}:${ip}`, "1", "EX", VIEW_WINDOW_SEC, "NX")
        if (!first) return false
    } catch {
        return false
    }
    await model.updateOne({ _id: id }, { $inc: { views: 1 } })
    return true
}
