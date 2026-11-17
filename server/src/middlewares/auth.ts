import "../types/express.js"
import type { NextFunction, Request, RequestHandler, Response } from "express"
import User, { type Role } from "../models/User.js"
import { AppError } from "../utils/AppError.js"
import { ACCESS_COOKIE, verifyAccess } from "../utils/tokens.js"

const readUser = async (token?: string) => {
    if (!token) return null
    try {
        const { id } = verifyAccess(token)
        return await User.findById(id)
    } catch {
        return null
    }
}

export const auth = async (req: Request, _res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.[ACCESS_COOKIE]
        if (!token) throw new AppError("Please log in", 401)
        const user = await readUser(token)
        if (!user) throw new AppError("Your session has expired", 401)
        if (user.isBanned) throw new AppError("Your account is banned. Please contact us.", 403)
        req.user = user
        next()
    } catch (error) {
        next(error)
    }
}

export const optionalAuth = async (req: Request, _res: Response, next: NextFunction) => {
    try {
        const user = await readUser(req.cookies?.[ACCESS_COOKIE])
        if (user && !user.isBanned) req.user = user
        next()
    } catch (error) {
        next(error)
    }
}

export const requireRole = (...roles: Role[]): RequestHandler => (req, _res, next) => {
    if (!req.user) return next(new AppError("Please log in", 401))
    if (!roles.includes(req.user.role)) return next(new AppError("You do not have access", 403))
    next()
}