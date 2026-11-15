import type { Types } from "mongoose"
import Notification, { type NotificationType } from "../models/Notification.js"

interface NotifyInput {
    type: NotificationType
    title: string
    text?: string
    href: string
    entityId?: Types.ObjectId | string
}

export async function notifyAdmins(input: NotifyInput) {
    try {
        await Notification.create({ ...input, scope: "admin", user: null })
    } catch (error) {
        console.error("notify admins failed", error)
    }
}

export async function notifyUser(user: Types.ObjectId | string | null | undefined, input: NotifyInput) {
    if (!user) return
    try {
        await Notification.create({ ...input, scope: "user", user })
    } catch (error) {
        console.error("notify user failed", error)
    }
}
