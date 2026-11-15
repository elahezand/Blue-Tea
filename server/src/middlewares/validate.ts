import type { RequestHandler } from "express"
import type { ZodError, ZodTypeAny } from "zod"
import { AppError, type FieldErrors } from "../utils/AppError.js"

interface Schemas {
    body?: ZodTypeAny
    query?: ZodTypeAny
    params?: ZodTypeAny
}

export const zodErrors = (error: ZodError): FieldErrors => {
    const errors: FieldErrors = {}
    for (const issue of error.issues) {
        const field = issue.path.join(".") || "form"
        if (!errors[field]) errors[field] = issue.message
    }
    return errors
}

export const validate = (schemas: Schemas): RequestHandler => (req, _res, next) => {
    for (const key of ["params", "query", "body"] as const) {
        const schema = schemas[key]
        if (!schema) continue
        const result = schema.safeParse(req[key])
        if (!result.success) return next(new AppError("Please check the form", 422, zodErrors(result.error)))
        Object.defineProperty(req, key, { value: result.data, writable: true, enumerable: true, configurable: true })
    }
    next()
}
