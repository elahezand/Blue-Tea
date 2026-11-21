"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MdOutlineNotifications, MdOutlineSupportAgent, MdOutlineChatBubbleOutline, MdOutlineReceiptLong, MdOutlineEventAvailable, MdOutlineMailOutline, MdOpenInNew } from "react-icons/md"
import type { IconType } from "react-icons"
import timeAgo from "@/components/modules/p-admin/timeAgo"
import type { Notification, NotificationType } from "@/types/notification"

const icons: Record<NotificationType, IconType> = {
    ticket: MdOutlineSupportAgent,
    comment: MdOutlineChatBubbleOutline,
    order: MdOutlineReceiptLong,
    reservation: MdOutlineEventAvailable,
    message: MdOutlineMailOutline,
}

interface NotificationItemProps {
    n: Notification
    onOpen: () => void
}

export function NotificationItem({ n, onOpen }: NotificationItemProps) {
    const router = useRouter()
    if (!n) return null
    const Icon = icons[n.type] || MdOutlineNotifications
    const unread = !n.read

    const open = () => {
        if (unread) onOpen()
        router.push(n.href)
    }

    return (
        <div className={`flex items-start gap-2 px-2 ${unread ? "bg-brown/[0.06]" : ""}`}>
            <button
                type="button"
                onClick={open}
                className="flex min-w-0 flex-1 cursor-pointer items-start gap-3 border-none bg-transparent px-2 py-3 text-left text-fg hover:bg-soft"
            >
                <span aria-hidden className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full text-lg ${unread ? "bg-brown text-white" : "bg-soft text-link"}`}>
                    <Icon />
                </span>
                <span className="min-w-0 flex-1">
                    <span className={`block text-sm ${unread ? "font-semibold" : "font-medium"}`}>{n.title}</span>
                    {n.text && <span className="block truncate text-sm text-muted">{n.text}</span>}
                    {n.time && (
                        <time dateTime={n.time} suppressHydrationWarning className="block text-xs text-muted">
                            {timeAgo(n.time)}
                        </time>
                    )}
                </span>
                {unread && <span aria-label="Unread" className="mt-2 size-2 shrink-0 rounded-full bg-brown" />}
            </button>

            <Link href={n.href} aria-label="Open" title="Open" className="mt-3 shrink-0 rounded-full p-1 text-lg text-muted no-underline hover:bg-soft hover:text-link">
                <MdOpenInNew aria-hidden />
            </Link>
        </div>
    )
}