import { createHmac, randomBytes } from "node:crypto"
import jwt from "jsonwebtoken"
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/env.js"

export const ACCESS_COOKIE = "token"
export const REFRESH_COOKIE = "refreshToken"

export interface AccessPayload {
    id: string
}

export const signAccess = (id: string) => jwt.sign({ id } satisfies AccessPayload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" })

export const verifyAccess = (token: string) => jwt.verify(token, ACCESS_TOKEN_SECRET) as AccessPayload

export const createRefreshToken = () => randomBytes(48).toString("base64url")

export const hashToken = (token: string) => createHmac("sha256", REFRESH_TOKEN_SECRET).update(token).digest("hex")