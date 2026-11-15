import jwt from "jsonwebtoken"
import { ACCESS_TOKEN_SECRET } from "../config/env.js"

export const ACCESS_COOKIE = "token"
export const REFRESH_COOKIE = "refreshToken"

export interface AccessPayload {
    id: string
}

export const verifyAccess = (token: string) => jwt.verify(token, ACCESS_TOKEN_SECRET) as AccessPayload
