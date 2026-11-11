"use client"
import { useState } from "react"
import { MdDoneAll, MdOutlineNotificationsNone } from "react-icons/md"
import { Spinner } from "@/components/feedback/loader"
import { NotificationItem } from "@/components/modules/notifications/notificationBell"
import { useGetNotifications, useMarkNotificationsRead } from "@/services/notification.service"
import type { NotificationScope } from "@/types/notification"

type Tab = "all" | "unread"

const chip = (on: boolean) => `cursor-pointer whitespace-nowrap rounded-full border border-solid px-4 py-1.5 text-sm font-medium transition-colors ${on ? "border-brown bg-brown text-white" : "border-line bg-surface text-fg hover:border-brown/50"}`

export default function NotificationsPage({ scope }: { scope: NotificationScope }) {
    const [tab, setTab] = useState<Tab>("all")
    const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetNotifications(scope, tab === "unread" ? { status: "unread" } : {})
    const { mutate: markRead } = useMarkNotificationsRead()
    const items = data?.items ?? []
    const unread = items.filter((n) => !n.read)

    return (
        <div className="max-w-3xl">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2" role="group" aria-label="Show notifications">
                    <button type="button" aria-pressed={tab === "all"} onClick={() => setTab("all")} className={chip(tab === "all")}>All</button>
                    <button type="button" aria-pressed={tab === "unread"} onClick={() => setTab("unread")} className={chip(tab === "unread")}>Unread</button>
                </div>
                {unread.length > 0 && <button type="button" onClick={() => markRead({ ids: unread.map((n) => n.id) })} className="inline-flex cursor-pointer items-center gap-1 border-none bg-transparent text-sm font-medium text-link hover:underline"><MdDoneAll aria-hidden />Mark all as read</button>}
            </div>
            {isLoading ? (
                <p className="py-10 text-center text-muted"><Spinner label="Loading" /></p>
            ) : items.length === 0 ? (
                <div className="flex flex-col items-center rounded-[2rem] bg-soft/70 px-6 py-14 text-center">
                    <span aria-hidden className="mb-3 flex size-14 items-center justify-center rounded-full bg-surface text-3xl text-link shadow-sm"><MdOutlineNotificationsNone /></span>
                    <h2 className="mb-1 text-xl text-fg">{tab === "unread" ? "Nothing unread" : "No notifications yet"}</h2>
                    <p className="m-0 text-sm text-muted">{tab === "unread" ? "You have seen everything." : "News about your tickets, orders and comments will show up here."}</p>
                </div>
            ) : (
                <ul className="m-0 list-none divide-y divide-[var(--line)] overflow-hidden rounded-2xl border border-solid border-line bg-surface p-0">
                    {items.map((n) => <li key={n.id}><NotificationItem n={n} onOpen={() => { if (!n.read) markRead({ ids: [n.id] }) }} /></li>)}
                </ul>
            )}
            {hasNextPage && (
                <div className="mt-6 text-center">
                    <button type="button" onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="btn-ghost">{isFetchingNextPage ? <Spinner label="Loading" /> : "Load more"}</button>
                </div>
            )}
        </div>
    )
}
