import React from "react"
import Link from "next/link"
import connectToDB from "@/configs/db"
import TicketModel from "@/model/ticket"
import "@/model/user"
import { paginate } from "@/utils/helper"
import Table from "@/components/modules/table/Table"
import Badge from "@/components/modules/badge"
import Pagination from "@/components/modules/pagination/pagination"
import TableToolbar from "@/components/modules/p-admin/TableToolbar"
import { ticketFilters } from "@/components/modules/p-admin/tableFilters"
import timeAgo from "@/components/modules/p-admin/timeAgo"
import { MdOutlineMarkChatUnread, MdOutlineMarkChatRead, MdOutlineLock } from "react-icons/md"

const statuses = ["Open", "Answered", "Closed"]

export default async function page({ searchParams }) {
    await connectToDB()
    const sp = await searchParams
    const status = statuses.includes(sp?.status) ? sp.status : null
    const [paginated, open, answered, closed] = await Promise.all([
        paginate(TicketModel, sp, status ? { status } : {}, "user"),
        TicketModel.countDocuments({ status: "Open" }),
        TicketModel.countDocuments({ status: "Answered" }),
        TicketModel.countDocuments({ status: "Closed" }),
    ])
    const tickets = JSON.parse(JSON.stringify(paginated.data))
    const stats = [
        { key: "Open", label: "Waiting for you", value: open, icon: MdOutlineMarkChatUnread, hot: open > 0 },
        { key: "Answered", label: "Answered", value: answered, icon: MdOutlineMarkChatRead },
        { key: "Closed", label: "Closed", value: closed, icon: MdOutlineLock },
    ]

    return (
        <>
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {stats.map((s) => (
                    <Link key={s.key} href={status === s.key ? "/p-admin/tickets" : `/p-admin/tickets?status=${s.key}`} aria-pressed={status === s.key}
                        className={`admin-card flex items-center gap-4 p-4 transition hover:-translate-y-0.5 hover:shadow-md ${status === s.key ? "!border-brown ring-2 ring-brown/20" : ""}`}>
                        <span className={`admin-icon ${s.hot ? "!bg-brown !text-white" : ""}`}><s.icon /></span>
                        <span>
                            <span className="block text-sm text-muted">{s.label}</span>
                            <span className="block font-display text-2xl font-semibold text-fg">{s.value}</span>
                        </span>
                    </Link>
                ))}
            </div>
            <Table title="Support tickets" toolbar={<TableToolbar fields={ticketFilters} />}>
                <thead><tr><th>Customer</th><th>Ticket</th><th>Topic</th><th>Status</th><th>Last activity</th><th><span className="sr-only">Open</span></th></tr></thead>
                <tbody>
                    {tickets.map((t) => {
                        const msgs = t.messages || []
                        const last = msgs[msgs.length - 1]
                        const waiting = t.status === "Open"
                        return (
                            <tr key={t._id} className={waiting ? "bg-brown/[0.04]" : ""}>
                                <td className="!max-w-[200px]">
                                    <div className="flex items-center gap-3">
                                        <span aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-full bg-soft font-medium text-link">{(t.user?.name || "?").charAt(0).toUpperCase()}</span>
                                        <span className="min-w-0">
                                            <span className="block truncate font-medium text-fg">{t.user?.name || "Unknown"}</span>
                                            <span className="block truncate text-xs text-muted">{t.user?.email}</span>
                                        </span>
                                    </div>
                                </td>
                                <td className="!max-w-[340px]">
                                    <Link href={`/p-admin/tickets/${t._id}`} className="flex items-center gap-2 font-medium text-fg hover:text-link">
                                        {waiting && <span aria-label="Needs a reply" className="size-2 shrink-0 rounded-full bg-brown" />}
                                        <span className="truncate">{t.subject}</span>
                                    </Link>
                                    {last && <span className="block truncate text-xs text-muted">{last.from === "admin" ? "You: " : ""}{last.text}</span>}
                                </td>
                                <td><span className="rounded-full border border-solid border-line px-3 py-0.5 text-xs text-muted">{t.department}</span></td>
                                <td><Badge value={t.status} /></td>
                                <td className="whitespace-nowrap text-sm">
                                    <span className="block text-fg">{timeAgo(t.updatedAt)}</span>
                                    <span className="block text-xs text-muted">{Math.max(msgs.length - 1, 0)} repl{msgs.length === 2 ? "y" : "ies"}</span>
                                </td>
                                <td className="text-end">
                                    <Link href={`/p-admin/tickets/${t._id}`} className={`inline-flex h-8 items-center rounded-full border border-solid px-4 text-xs font-medium ${waiting ? "border-brown bg-brown !text-white hover:brightness-110" : "border-line bg-surface text-fg hover:bg-soft"}`}>{waiting ? "Reply" : "View"}</Link>
                                </td>
                            </tr>
                        )
                    })}
                    {tickets.length === 0 && <tr><td colSpan="6" className="!py-10 text-center text-muted">No tickets {status ? `marked ${status.toLowerCase()}` : "match"}.</td></tr>}
                </tbody>
            </Table>
            <Pagination currentPage={paginated.page} pageCount={paginated.pageCount} limit={paginated.limit} />
        </>
    )
}
