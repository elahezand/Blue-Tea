import type { CookieOptions, Response } from "express"
import { IS_DEV } from "../config/env.js"
import { ACCESS_COOKIE, REFRESH_COOKIE } from "./tokens.js"

export const ACCESS_TTL_MS = 15 * 60 * 1000
export const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000

const base: CookieOptions = {
    httpOnly: true,
    secure: !IS_DEV,
    sameSite: "lax",
    path: "/",
}

export const setAuthCookies = (res: Response, tokens: { accessToken: string; refreshToken: string }) => {
    res.cookie(ACCESS_COOKIE, tokens.accessToken, { ...base, maxAge: ACCESS_TTL_MS })
    res.cookie(REFRESH_COOKIE, tokens.refreshToken, { ...base, maxAge: REFRESH_TTL_MS })
}

export const clearAuthCookies = (res: Response) => {
    res.clearCookie(ACCESS_COOKIE, base)
    res.clearCookie(REFRESH_COOKIE, base)
}
