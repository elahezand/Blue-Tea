import type { FilterQuery, HydratedDocument, Types } from "mongoose"
import Notification, { type INotification, type NotificationStatus } from "../models/Notification.js"
import User, { type IUser } from "../models/User.js"
import type { CreateNotificationBody } from "../schemas/notification.schema.js"
import { AppError } from "../utils/AppError.js"
import { paginate } from "../utils/paginate.js"

type UserDoc = HydratedDocument<IUser>

const PUBLIC_FIELDS = "type title text href readBy createdAt"
const SORTS = {
    latest: { createdAt: -1 },
    oldest: { createdAt: 1 },
} as const

const statusFilter = (status: NotificationStatus | undefined, userId: Types.ObjectId): FilterQuery<INotification> => {
    if (status === "unread") return { readBy: { $ne: userId } }
    if (status === "read") return { readBy: userId }
    return {}
}

const toView = (doc: any, userId: Types.ObjectId) => {
    const n = typeof doc.toObject === "function" ? doc.toObject() : doc
    return {
        id: String(n._id),
        type: n.type,
        title: n.title,
        text: n.text,
        href: n.href,
        time: n.createdAt,
        read: (n.readBy ?? []).some((id: Types.ObjectId) => String(id) === String(userId)),
    }
}

/* ---------- User & Admin (own notifications) ---------- */

export const list = async (
    userId: Types.ObjectId,
    { limit, cursor, sort, status }: { limit?: number; cursor?: string; sort?: "latest" | "oldest"; status?: NotificationStatus }
) => {
    const { data, pagination } = await paginate(Notification, {
        limit,
        cursor,
        filters: { user: userId, ...statusFilter(status, userId) },
        sort: SORTS[sort ?? "latest"],
        select: PUBLIC_FIELDS,
    })

    return { data: data.map((n) => toView(n, userId)), pagination }
}

export const markRead = async (userId: Types.ObjectId, id: string) => {
    const notification = await Notification.findOneAndUpdate(
        { _id: id, user: userId },
        { $addToSet: { readBy: userId } },
        { new: true }
    )
    if (!notification) throw new AppError("Notification not found", 404)
    return notification
}

export const remove = async (userId: Types.ObjectId, id: string) => {
    const { deletedCount } = await Notification.deleteOne({ _id: id, user: userId })
    if (!deletedCount) throw new AppError("Notification not found", 404)
}

/* ---------- Admin ---------- */

export const listRecipients = async (sender: UserDoc) => {
    const admins = await User.find({ role: "ADMIN", isBanned: { $ne: true } }).select("name").sort({ name: 1, _id: 1 }).lean()
    return admins.map(({ _id, name }) => ({ id: String(_id), name, isSelf: String(_id) === String(sender._id) }))
}

export const create = async (sender: UserDoc, data: CreateNotificationBody) => {
    if (sender.role !== "ADMIN") throw new AppError("Only admins can send notifications", 403)

    const receiver = await User.findById(data.user).select("role isBanned").lean()
    if (!receiver) throw new AppError("Recipient not found", 404)
    if (receiver.role !== "ADMIN") throw new AppError("Notifications can only be sent to admins", 403)
    if (receiver.isBanned) throw new AppError("This recipient is inactive", 403)

    return Notification.create(data)
}
