import app from "./app.js"
import { connectDB, disconnectDB } from "./config/db.js"
import { PORT } from "./config/env.js"
import redis from "./config/redis.js"

const start = async () => {
    await connectDB()
    await redis.connect().catch(() => console.warn("Redis is not running: cache and OTP are off"))

    const server = app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))

    const shutdown = async (signal: string) => {
        console.log(`${signal} received, closing...`)
        server.close()
        await Promise.allSettled([disconnectDB(), redis.quit()])
        process.exit(0)
    }

    process.on("SIGINT", () => void shutdown("SIGINT"))
    process.on("SIGTERM", () => void shutdown("SIGTERM"))
}

start().catch((error) => {
    console.error("Server failed to start", error)
    process.exit(1)
})
