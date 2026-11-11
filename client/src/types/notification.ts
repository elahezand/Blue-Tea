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
    ids: string[]
}
