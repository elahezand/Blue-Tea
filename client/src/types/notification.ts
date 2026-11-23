export type NotificationType = "ticket" | "comment" | "reservation" | "order" | "message"

export type NotificationScope = "user" | "admin"

export interface Notification {
    id: string
    type: NotificationType
    title: string
    text?: string
    href: string
    time?: string
    read?: boolean
}

export interface MarkReadBody {
    id: string
}

export interface NotificationRecipient {
    id: string
    name: string
    isSelf: boolean
}

export interface CreateNotificationBody {
    scope: "admin"
    user: string
    type: NotificationType
    title: string
    text?: string
    href: string
}
