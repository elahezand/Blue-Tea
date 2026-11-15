import type { ErrorRequestHandler, RequestHandler } from "express"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import multer from "multer"
import { ZodError } from "zod"
import { IS_DEV } from "../config/env.js"
import { AppError } from "../utils/AppError.js"
import { MAX_IMAGE_SIZE } from "./upload.js"
import { zodErrors } from "./validate.js"

export const notFound: RequestHandler = (req, _res, next) => {
    next(new AppError(`Not found: ${req.method} ${req.originalUrl}`, 404))
}

const toAppError = (error: unknown): AppError => {
    if (error instanceof AppError) return error
    if (error instanceof ZodError) return new AppError("Please check the form", 422, zodErrors(error))
    if (error instanceof mongoose.Error.ValidationError) {
        const errors = Object.fromEntries(Object.entries(error.errors).map(([field, e]) => [field, e.message]))
        return new AppError("Please check the form", 422, errors)
    }
    if (error instanceof mongoose.Error.CastError) return new AppError(`Invalid ${error.path}`, 400)
    if (error instanceof multer.MulterError) {
        const message = error.code === "LIMIT_FILE_SIZE" ? `Image must be under ${MAX_IMAGE_SIZE / 1024 / 1024} MB` : error.message
        return new AppError(message, 422, error.field ? { [error.field]: message } : undefined)
    }
    if (error instanceof jwt.JsonWebTokenError) return new AppError("Your session has expired", 401)
    if (typeof error === "object" && error && "code" in error && error.code === 11000) {
        const field = Object.keys((error as { keyValue?: object }).keyValue ?? {})[0] ?? "field"
        return new AppError(`This ${field} is already used`, 409, { [field]: `This ${field} is already used` })
    }
    const unknown = new AppError(error instanceof Error ? error.message : "Something went wrong", 500)
    unknown.stack = error instanceof Error ? error.stack : undefined
    return unknown
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    const appError = toAppError(error)
    if (appError.status >= 500) console.error(error)
    res.status(appError.status).json({
        success: false,
        message: appError.status >= 500 && !IS_DEV ? "Something went wrong" : appError.message,
        ...(appError.errors ? { errors: appError.errors } : {}),
    })
}
