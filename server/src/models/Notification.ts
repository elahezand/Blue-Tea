import { Schema, model, type Types } from "mongoose"

export const NOTIFICATION_TYPES = ["order", "reservation", "ticket", "comment", "message"] as const
export const NOTIFICATION_SCOPES = ["user", "admin"] as const

export type NotificationType = (typeof NOTIFICATION_TYPES)[number]
export type NotificationScope = (typeof NOTIFICATION_SCOPES)[number]

export interface INotification {
    scope: NotificationScope
    user: Types.ObjectId | null
    type: NotificationType
    title: string
    text?: string
    href: string
    entityId: Types.ObjectId | null
    readBy: Types.ObjectId[]
    createdAt: Date
    updatedAt: Date
}

const notificationSchema = new Schema<INotification>({
    scope: { type: String, enum: NOTIFICATION_SCOPES, required: true },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
        required: [function (this: INotification) { return this.scope === "user" }, "User is required for a user notification"],
    },
    type: { type: String, enum: NOTIFICATION_TYPES, required: true },
    title: { type: String, required: true, trim: true },
    text: { type: String, trim: true },
    href: { type: String, required: true },
    entityId: { type: Schema.Types.ObjectId, default: null },
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true })

notificationSchema.index({ scope: 1, user: 1, createdAt: -1 })
notificationSchema.index({ scope: 1, user: 1, readBy: 1 })
notificationSchema.index({ entityId: 1 })
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 })

const Notification = model<INotification>("Notification", notificationSchema)

export default Notification
