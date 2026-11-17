import "../types/express.js"
import type { Request } from "express"
import { AppError } from "./AppError.js"

export const getUser = (req: Pick<Request, "user">) => {
    if (!req.user) throw new AppError("Please log in", 401)
    return req.user
}