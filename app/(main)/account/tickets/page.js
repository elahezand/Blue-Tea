import React from "react"
import Link from "next/link"
import connectToDB from "@/configs/db"
import TicketModel from "@/model/ticket"
import { authUser } from "@/utils/auth"
import UserPanelLayout from "../UserPanelLayout"
import Table from "@/components/modules/table/Table"
import Badge from "@/components/modules/badge"
import EmptyState from "@/components/modules/emptyState"
import timeAgo from "@/components/modules/p-admin/timeAgo"
import { MdOutlineSupportAgent, MdOutlineAdd } from "react-icons/md"

const tabs = [
    { key: "", label: "All" },
    { key: "Answered", label: "Answered" },
    { key: "Open", label: "Waiting" },
    { key: "Closed", label: "Closed" },
]

export default async function page({ searchParams }) {
    await connectToDB()
    const sp = await searchParams
    const user = await authUser()
    const all = user ? JSON.parse(JSON.stringify(await TicketModel.find({ user: user._id }).sort({ updatedAt: -1 }).lean())) : []
    const tab = tabs.some((t) => t.key && t.key === sp?.status) ? sp.status : ""
    const tickets = tab ? all.filter((t) => t.status === tab) : all
    const count = (k) => (k ? all.filter((t) => t.status === k).length : all.length)
    const chip = (on) => `inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-solid px-4 py-1.5 text-sm font-medium transition-colors ${on ? "border-brown bg-brown !text-white" : "border-line bg-surface text-fg hover:border-brown/50"}`

    return (
        <UserPanelLayout title="Support tickets">
            {all.length === 0 ? (
                <EmptyState icon={<MdOutlineSupportAgent />} title="No tickets yet" text="Problem with an order or a booking? Send us a ticket and we will answer here." href="/account/tickets/new" action="New ticket" />
            ) : (
                <>
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex gap-2 overflow-x-auto" role="group" aria-label="Show tickets">
                            {tabs.map((t) => (
                                <Link key={t.label} href={t.key ? `/account/tickets?status=${t.key}` : "/account/tickets"} aria-current={tab === t.key ? "true" : undefined} className={chip(tab === t.key)}>
                                    {t.label}<span className={`text-xs ${tab === t.key ? "text-white/80" : "text-muted"}`}>{count(t.key)}</span>
                                </Link>
                            ))}
                        </div>
                        <Link href="/account/tickets/new" className="btn-organic inline-flex items-center gap-1 bg-brown px-5 py-2 text-sm font-medium !text-white"><MdOutlineAdd aria-hidden className="text-lg" />New ticket</Link>
                    </div>
                    <Table>
                        <thead><tr><th>Ticket</th><th>Topic</th><th>Status</th><th>Last update</th></tr></thead>
                        <tbody>
                            {tickets.map((t) => {
                                const last = t.messages?.[t.messages.length - 1]
                                const answered = t.status === "Answered"
                                return (
                                    <tr key={t._id} className={answered ? "bg-[var(--green)]/[0.07]" : ""}>
                                        <td className="!max-w-[340px]">
                                            <Link href={`/account/tickets/${t._id}`} className="flex items-center gap-2 font-medium text-fg hover:text-link">
                                                {answered && <span aria-label="New reply" className="size-2 shrink-0 rounded-full bg-[var(--green)]" />}
                                                <span className="truncate">{t.subject}</span>
                                            </Link>
                                            {last && <span className="block truncate text-xs text-muted">{last.from === "admin" ? "Blue Tea: " : "You: "}{last.text}</span>}
                                        </td>
                                        <td>{t.department}</td>
                                        <td><Badge value={t.status === "Open" ? "Waiting for reply" : t.status} /></td>
                                        <td className="whitespace-nowrap">{timeAgo(t.updatedAt)}</td>
                                    </tr>
                                )
                            })}
                            {tickets.length === 0 && <tr><td colSpan="4" className="!py-8 text-center text-muted">No {tab === "Open" ? "waiting" : tab.toLowerCase()} tickets.</td></tr>}
                        </tbody>
                    </Table>
                </>
            )}
        </UserPanelLayout>
    )
}
