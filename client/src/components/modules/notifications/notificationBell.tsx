"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { MdOutlineNotifications } from "react-icons/md"
import { useDeleteNotification, useGetNotifications, useMarkNotificationRead } from "@/services/notification.service"
import type { Notification, NotificationScope } from "@/types/notification"
import { NotificationItem } from "./NotificationItem"


interface NotificationBellProps {
    scope: NotificationScope
    allHref?: string
    popoverClass?: string
}

export default function NotificationBell({ scope, allHref, popoverClass = "right-0" }: NotificationBellProps) {
    const [open, setOpen] = useState(false)
    const box = useRef<HTMLDivElement>(null)
    const { data } = useGetNotifications(scope, { limit: 6 })
    const { mutate: markRead } = useMarkNotificationRead()
    const { mutate: remove, isPending: removing } = useDeleteNotification()

    const items = ((data?.items ?? []) as Notification[]).filter(Boolean)
    const unread = items.filter((n) => !n.read)

    useEffect(() => {
        if (!open) return
        const away = (e: MouseEvent) => {
            if (e.target instanceof Element && e.target.closest("[data-rht-toaster]")) return
            if (box.current && !box.current.contains(e.target as Node)) setOpen(false)
        }
        const esc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false)
        }
        document.addEventListener("mousedown", away)
        document.addEventListener("keydown", esc)
        return () => {
            document.removeEventListener("mousedown", away)
            document.removeEventListener("keydown", esc)
        }
    }, [open])

    return (
        <div ref={box} className="relative">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-haspopup="true"
                aria-label={unread.length ? `Notifications, ${unread.length} unread` : "Notifications"}
                className="relative flex size-10 cursor-pointer items-center justify-center rounded-full border border-solid border-line bg-surface text-xl text-fg transition-colors hover:border-brown/50 hover:bg-soft"
            >
                <MdOutlineNotifications aria-hidden />
                {unread.length > 0 && (
                    <span aria-hidden className="absolute -top-1 -right-1 flex min-w-5 items-center justify-center rounded-full bg-[var(--danger)] px-1 text-[11px] leading-5 font-semibold text-white">
                        {unread.length > 5 ? "5+" : unread.length}
                    </span>
                )}
            </button>

            {open && (
                <div
                    role="region"
                    aria-label="Notifications"
                    className={`absolute top-12 z-[1100] w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-solid border-line bg-surface shadow-xl ${popoverClass}`}
                >
                    <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
                        <h2 className="m-0 font-body text-sm font-semibold text-fg">Notifications</h2>
                    </div>

                    {items.length === 0 ? (
                        <p className="m-0 px-4 py-10 text-center text-sm text-muted">You are all caught up.</p>
                    ) : (
                        <ul className="m-0 max-h-[26rem] list-none divide-y divide-[var(--line)] overflow-y-auto p-0">
                            {items.map((n) => (
                                <li key={n.id}>
                                    <NotificationItem
                                        n={n}
                                        onOpen={() => {
                                            if (!n.read) markRead({ id: n.id })
                                            setOpen(false)
                                        }}
                                        onRemove={() => remove(n.id)}
                                        removeDisabled={removing}
                                        removeIconOnly
                                    />
                                </li>
                            ))}
                        </ul>
                    )}

                    {allHref && (
                        <Link
                            href={allHref}
                            onClick={() => setOpen(false)}
                            className="block border-t border-line px-4 py-3 text-center text-sm font-medium text-link no-underline hover:bg-soft"
                        >
                            View all notifications
                        </Link>
                    )}
                </div>
            )}
        </div>
    )
}
