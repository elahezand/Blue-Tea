import type { NextFunction, Request, Response } from "express"
import type { ListQuery } from "../schemas/common.schema.js"
import type { MarkReadBody } from "../schemas/notification.schema.js"
import * as notificationService from "../services/notification.service.js"
import { getUser } from "../utils/request.js"
import { sendList, sendMessage } from "../utils/response.js"

export const getMyNotifications = async (req: Request<{}, any, any, ListQuery>, res: Response, next: NextFunction) => {
    try {
        const { data, pagination } = await notificationService.list("user", getUser(req)._id, req.query)
        sendList(res, data, pagination)
    } catch (error) {
        next(error)
    }
}

export const getAdminNotifications = async (req: Request<{}, any, any, ListQuery>, res: Response, next: NextFunction) => {
    try {
        const { data, pagination } = await notificationService.list("admin", getUser(req)._id, req.query)
        sendList(res, data, pagination)
    } catch (error) {
        next(error)
    }
}

export const markRead = async (req: Request<{}, any, MarkReadBody>, res: Response, next: NextFunction) => {
    try {
        await notificationService.markRead(getUser(req), req.body.ids)
        sendMessage(res, "Marked as read")
    } catch (error) {
        next(error)
    }
}
