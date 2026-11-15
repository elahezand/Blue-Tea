import { Redis } from "ioredis"
import { REDIS_URL } from "./env.js"

const redis = new Redis(REDIS_URL, { maxRetriesPerRequest: 1, lazyConnect: true })

redis.on("error", (error) => console.error("redis error", error.message))

export default redis
