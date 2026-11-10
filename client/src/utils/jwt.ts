
export interface JwtPayload {
    exp?: number
    iat?: number
    email?: string
    role?: string
    [key: string]: unknown
}

export const decodeJwt = (token?: string | null): JwtPayload | null => {
    try {
        const part = String(token || "").split(".")[1]
        if (!part) return null
        const base64 = part.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(part.length / 4) * 4, "=")
        const json = decodeURIComponent(
            atob(base64).split("").map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0")).join("")
        )
        const payload: unknown = JSON.parse(json)
        return payload && typeof payload === "object" ? (payload as JwtPayload) : null
    } catch {
        return null
    }
}

export const isJwtExpired = (payload: JwtPayload | null, skewSeconds = 10): boolean =>
    !!payload?.exp && payload.exp * 1000 <= Date.now() + skewSeconds * 1000
