import "dotenv/config"

const required = (name: string) => {
    const value = process.env[name]
    if (!value) throw new Error(`${name} is missing in .env`)
    return value
}

export const IS_DEV = process.env.NODE_ENV !== "production"
export const PORT = Number(process.env.PORT) || 4000
export const MONGO_URI = required("MONGO_URI")
export const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379"
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000"
export const ACCESS_TOKEN_SECRET = required("ACCESS_TOKEN_SECRET")
export const REFRESH_TOKEN_SECRET = required("REFRESH_TOKEN_SECRET")
export const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads"
