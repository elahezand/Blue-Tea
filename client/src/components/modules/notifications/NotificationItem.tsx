"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MdClose, MdOutlineNotifications, MdOutlineSupportAgent, MdOutlineChatBubbleOutline, MdOutlineReceiptLong, MdOutlineEventAvailable, MdOutlineMailOutline, MdOpenInNew } from "react-icons/md"
import type { IconType } from "react-icons"
import timeAgo from "@/components/modules/p-admin/timeAgo"
import swal from "@/components/modules/swal"
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
    onRemove?: () => void
    removeDisabled?: boolean
    removeIconOnly?: boolean
}

export function NotificationItem({ n, onOpen, onRemove, removeDisabled, removeIconOnly = false }: NotificationItemProps) {
    const router = useRouter()
    const [confirming, setConfirming] = useState(false)
    if (!n) return null
    const Icon = icons[n.type] || MdOutlineNotifications
    const unread = !n.read

    const open = () => {
        if (unread) onOpen()
        router.push(n.href)
    }

    const confirmRemove = async () => {
        setConfirming(true)
        const confirmed = await swal({ title: "Remove this notification?", buttons: ["Cancel", "Remove"] })
        setConfirming(false)
        if (confirmed === true) onRemove?.()
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
            {onRemove && (
                <button
                    type="button"
                    onClick={confirmRemove}
                    disabled={removeDisabled || confirming}
                    aria-label={`Remove notification: ${n.title}`}
                    title="Remove notification"
                    className={`mt-3 shrink-0 rounded-full border-none bg-transparent text-muted hover:bg-soft hover:text-fg disabled:opacity-50 ${removeIconOnly ? "grid size-8 place-items-center text-lg" : "px-2 py-1 text-xs"}`}
                >
                    {removeIconOnly ? <MdClose aria-hidden /> : "Remove"}
                </button>
            )}
        </div>
    )
}
