import type { RequestHandler } from "express"
import { isValidObjectId } from "mongoose"
import { AppError } from "../utils/AppError.js"

export const validateId = (...names: string[]): RequestHandler => (req, _res, next) => {
    const keys = names.length ? names : ["id"]
    const bad = keys.find((key) => !isValidObjectId(req.params[key]))
    if (bad) return next(new AppError(`Invalid ${bad}`, 400))
    next()
}
