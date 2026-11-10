"use client"
import { useState } from "react"
import { MdDoneAll, MdOutlineNotificationsNone } from "react-icons/md"
import { NotificationItem, useRead, type NotificationScope } from "@/components/modules/notifications/NotificationBell"
import type { Notification } from "@/types/models"

interface NotificationsPageProps {
    scope: NotificationScope
    items?: Notification[]
}

export default function NotificationsPage({ scope, items = [] }: NotificationsPageProps) {
    const [tab, setTab] = useState<"all" | "unread">("all")
    const { read, unread, mark } = useRead(scope, items)
    const list = tab === "unread" ? unread : items
    const chip = (on: boolean) => `cursor-pointer whitespace-nowrap rounded-full border border-solid px-4 py-1.5 text-sm font-medium transition-colors ${on ? "border-brown bg-brown text-white" : "border-line bg-surface text-fg hover:border-brown/50"}`

    return (
        <div className="max-w-3xl">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2" role="group" aria-label="Show notifications">
                    <button type="button" aria-pressed={tab === "all"} onClick={() => setTab("all")} className={chip(tab === "all")}>All <span className={tab === "all" ? "text-white/80" : "text-muted"}>{items.length}</span></button>
                    <button type="button" aria-pressed={tab === "unread"} onClick={() => setTab("unread")} className={chip(tab === "unread")}>Unread <span className={tab === "unread" ? "text-white/80" : "text-muted"}>{unread.length}</span></button>
                </div>
                {unread.length > 0 && <button type="button" onClick={() => mark(items.map((n) => n.id))} className="inline-flex cursor-pointer items-center gap-1 border-none bg-transparent text-sm font-medium text-link hover:underline"><MdDoneAll aria-hidden />Mark all as read</button>}
            </div>
            {list.length === 0 ? (
                <div className="flex flex-col items-center rounded-[2rem] bg-soft/70 px-6 py-14 text-center">
                    <span aria-hidden className="mb-3 flex size-14 items-center justify-center rounded-full bg-surface text-3xl text-link shadow-sm"><MdOutlineNotificationsNone /></span>
                    <h2 className="mb-1 text-xl text-fg">{tab === "unread" ? "Nothing unread" : "No notifications yet"}</h2>
                    <p className="m-0 text-sm text-muted">{tab === "unread" ? "You have seen everything." : "News about your tickets, orders and comments will show up here."}</p>
                </div>
            ) : (
                <ul className="m-0 list-none divide-y divide-[var(--line)] overflow-hidden rounded-2xl border border-solid border-line bg-surface p-0">
                    {list.map((n) => <li key={n.id}><NotificationItem n={n} unread={!read.includes(n.id)} onOpen={() => mark([n.id])} /></li>)}
                </ul>
            )}
        </div>
    )
}
