import type { NextFunction, Request, Response } from "express"
import type { ListQuery } from "../schemas/common.schema.js"
import type { MarkReadBody, CreateNotificationBody } from "../schemas/notification.schema.js"
import type { NotificationStatus } from "../models/Notification.js"
import * as notificationService from "../services/notification.service.js"
import { getUser } from "../utils/request.js"
import { send, sendList, sendMessage } from "../utils/response.js"

type IdParams = { id: string }
type NotificationQuery = ListQuery & { status?: NotificationStatus; sort?: "latest" | "oldest" }

/* ---------- User & Admin (own notifications) ---------- */

export const getNotifications = async (req: Request<{}, any, any, NotificationQuery>, res: Response, next: NextFunction) => {
    try {
        const { data, pagination } = await notificationService.list(getUser(req)._id, req.query)
        sendList(res, data, pagination)
    } catch (error) {
        next(error)
    }
}

export const markRead = async (req: Request<{}, {}, MarkReadBody>, res: Response, next: NextFunction) => {
    try {
        await notificationService.markRead(getUser(req)._id, req.body.id)
        sendMessage(res, "Notifications marked as read")
    } catch (error) {
        next(error)
    }
}

export const remove = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    try {
        await notificationService.remove(getUser(req)._id, req.params.id)
        sendMessage(res, "Notification deleted successfully")
    } catch (error) {
        next(error)
    }
}

/* ---------- Admin ---------- */

export const post = async (req: Request<{}, any, CreateNotificationBody>, res: Response, next: NextFunction) => {
    try {
        const notification = await notificationService.create(getUser(req), req.body)
        send(res, notification, 201)
    } catch (error) {
        next(error)
    }
}