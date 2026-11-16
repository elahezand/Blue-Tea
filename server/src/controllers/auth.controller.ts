import type { NextFunction, Request, Response } from "express"
import type { SendCodeBody, VerifyCodeBody } from "../schemas/auth.schema.js"
import * as authService from "../services/auth.service.js"
import { AppError } from "../utils/AppError.js"
import { clearAuthCookies, setAuthCookies } from "../utils/cookies.js"
import { send, sendMessage } from "../utils/response.js"
import { REFRESH_COOKIE } from "../utils/tokens.js"

const meta = (req: Request) => ({
    ip: req.ip ?? "unknown",
    userAgent: req.get("user-agent") ?? "",
})

export const sendCode = async (req: Request<{}, any, SendCodeBody>, res: Response, next: NextFunction) => {
    try {
        await authService.sendCode(req.body.phone)
        sendMessage(res, "We sent you a code")
    } catch (error) {
        next(error)
    }
}

export const verifyCode = async (req: Request<{}, any, VerifyCodeBody>, res: Response, next: NextFunction) => {
    try {
        const { user, tokens } = await authService.verifyCode(req.body, meta(req))
        setAuthCookies(res, tokens)
        send(res, user)
    } catch (error) {
        next(error)
    }
}

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.[REFRESH_COOKIE]
        if (!token) throw new AppError("Please log in", 401)
        const tokens = await authService.refresh(token, meta(req))
        setAuthCookies(res, tokens)
        sendMessage(res, "Session refreshed")
    } catch (error) {
        next(error)
    }
}

export const signout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await authService.signout(req.cookies?.[REFRESH_COOKIE])
        clearAuthCookies(res)
        sendMessage(res, "Signed out")
    } catch (error) {
        next(error)
    }
}
