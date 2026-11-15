import type { Response } from "express"

export interface CursorPagination {
    nextCursor: string | null
    limit: number
    hasMore: boolean
}

export const send = <T>(res: Response, data: T, status = 200) =>
    res.status(status).json({ success: true, data })

export const sendList = <T>(res: Response, data: T[], pagination: CursorPagination, status = 200) =>
    res.status(status).json({ success: true, data, pagination })

export const sendMessage = <T = null>(res: Response, message: string, status = 200, data: T | null = null) =>
    res.status(status).json({ success: true, data, message })

export const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")