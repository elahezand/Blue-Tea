import { z } from "zod"
import { objectId } from "./common.schema.js"
import { NOTIFICATION_TYPES, NOTIFICATION_SCOPES } from "../models/Notification.js"
import { listQuery } from "./common.schema.js"

export const notificationListQuery = listQuery.extend({
    status: z.enum(["read", "unread"]).optional(),
    sort: z.enum(["latest", "oldest"]).optional(),
})
export const markReadSchema = z.object({
    id: objectId("notification"),
})
const internalHref = z
    .string()
    .trim()
    .max(300)
    .regex(/^\/(?!\/)[^\s\\]*$/, "Link must be an internal path like /p-admin/orders")

export const createNotificationSchema = z
    .object({
        scope: z.enum(NOTIFICATION_SCOPES),
        user: objectId("user"),
        type: z.enum(NOTIFICATION_TYPES),
        title: z.string().trim().min(1, "Title is required").max(200),
        text: z.string().trim().max(1000).optional(),
        href: internalHref,
        entityId: objectId("entity").nullable().default(null),
    })

export type CreateNotificationBody = z.infer<typeof createNotificationSchema>

export type MarkReadBody = z.infer<typeof markReadSchema>
