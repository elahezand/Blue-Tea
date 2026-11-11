"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { MdOutlineNotifications, MdOutlineSupportAgent, MdOutlineChatBubbleOutline, MdOutlineReceiptLong, MdOutlineEventAvailable, MdOutlineMailOutline, MdDoneAll } from "react-icons/md"
import type { IconType } from "react-icons"
import timeAgo from "@/components/modules/p-admin/timeAgo"
import { useGetNotifications, useMarkNotificationsRead } from "@/services/notification.service"
import type { Notification, NotificationScope, NotificationType } from "@/types/notification"

const icons: Record<NotificationType, IconType> = { ticket: MdOutlineSupportAgent, comment: MdOutlineChatBubbleOutline, order: MdOutlineReceiptLong, reservation: MdOutlineEventAvailable, message: MdOutlineMailOutline }

interface NotificationItemProps {
    n: Notification
    onOpen: () => void
}

export function NotificationItem({ n, onOpen }: NotificationItemProps) {
    const Icon = icons[n.type] || MdOutlineNotifications
    const unread = !n.read
    return (
        <Link href={n.href} onClick={onOpen} className={`flex items-start gap-3 px-4 py-3 text-fg no-underline transition-colors hover:bg-soft ${unread ? "bg-brown/[0.06]" : ""}`}>
            <span aria-hidden className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full text-lg ${unread ? "bg-brown text-white" : "bg-soft text-link"}`}><Icon /></span>
            <span className="min-w-0 flex-1">
                <span className={`block text-sm ${unread ? "font-semibold" : "font-medium"}`}>{n.title}</span>
                {n.text && <span className="block truncate text-sm text-muted">{n.text}</span>}
                <time dateTime={n.time} suppressHydrationWarning className="block text-xs text-muted">{timeAgo(n.time)}</time>
            </span>
            {unread && <span aria-label="Unread" className="mt-2 size-2 shrink-0 rounded-full bg-brown" />}
        </Link>
    )
}

interface NotificationBellProps {
    scope: NotificationScope
    allHref?: string
    popoverClass?: string
}

export default function NotificationBell({ scope, allHref, popoverClass = "right-0" }: NotificationBellProps) {
    const [open, setOpen] = useState(false)
    const box = useRef<HTMLDivElement>(null)
    const { data } = useGetNotifications(scope, { limit: 6 })
    const { mutate: markRead } = useMarkNotificationsRead()
    const items = data?.items ?? []
    const unread = items.filter((n) => !n.read)

    useEffect(() => {
        if (!open) return
        const away = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false) }
        const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
        document.addEventListener("mousedown", away)
        document.addEventListener("keydown", esc)
        return () => {
            document.removeEventListener("mousedown", away)
            document.removeEventListener("keydown", esc)
        }
    }, [open])

    return (
        <div ref={box} className="relative">
            <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="true"
                aria-label={unread.length ? `Notifications, ${unread.length} unread` : "Notifications"}
                className="relative flex size-10 cursor-pointer items-center justify-center rounded-full border border-solid border-line bg-surface text-xl text-fg transition-colors hover:border-brown/50 hover:bg-soft">
                <MdOutlineNotifications aria-hidden />
                {unread.length > 0 && <span aria-hidden className="absolute -top-1 -right-1 flex min-w-5 items-center justify-center rounded-full bg-[var(--danger)] px-1 text-[11px] leading-5 font-semibold text-white">{unread.length > 5 ? "5+" : unread.length}</span>}
            </button>
            {open && (
                <div role="region" aria-label="Notifications" className={`absolute top-12 z-[1100] w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-solid border-line bg-surface shadow-xl ${popoverClass}`}>
                    <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
                        <h2 className="m-0 font-body text-sm font-semibold text-fg">Notifications</h2>
                        {unread.length > 0 && (
                            <button type="button" onClick={() => markRead({ ids: unread.map((n) => n.id) })} className="inline-flex cursor-pointer items-center gap-1 border-none bg-transparent text-xs font-medium text-link hover:underline"><MdDoneAll aria-hidden />Mark all as read</button>
                        )}
                    </div>
                    {items.length === 0 ? (
                        <p className="m-0 px-4 py-10 text-center text-sm text-muted">You are all caught up.</p>
                    ) : (
                        <ul className="m-0 max-h-[26rem] list-none divide-y divide-[var(--line)] overflow-y-auto p-0">
                            {items.map((n) => <li key={n.id}><NotificationItem n={n} onOpen={() => { if (!n.read) markRead({ ids: [n.id] }); setOpen(false) }} /></li>)}
                        </ul>
                    )}
                    {allHref && <Link href={allHref} onClick={() => setOpen(false)} className="block border-t border-line px-4 py-3 text-center text-sm font-medium text-link no-underline hover:bg-soft">View all notifications</Link>}
                </div>
            )}
        </div>
    )
}
