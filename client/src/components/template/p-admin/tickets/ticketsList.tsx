"use client"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { MdOutlineMarkChatUnread, MdOutlineMarkChatRead, MdOutlineLock } from "react-icons/md"
import Badge from "@/components/modules/badge"
import Table from "@/components/modules/table/table"
import TableState from "@/components/modules/table/tableState"
import TableToolbar from "@/components/modules/p-admin/tableToolbar"
import { ticketFilters } from "@/components/modules/p-admin/tableFilters"
import timeAgo from "@/components/modules/p-admin/timeAgo"
import { useGetAdminTickets, useGetTicketStats } from "@/services/ticket.service"

export default function TicketsList() {
    const params = Object.fromEntries(useSearchParams().entries())
    const status = params.status
    const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetAdminTickets(params)
    const { data: counts } = useGetTicketStats()
    const tickets = data?.items ?? []
    const stats = [
        { key: "Open", label: "Waiting for you", value: counts?.open ?? 0, icon: MdOutlineMarkChatUnread },
        { key: "Answered", label: "Answered", value: counts?.answered ?? 0, icon: MdOutlineMarkChatRead },
        { key: "Closed", label: "Closed", value: counts?.closed ?? 0, icon: MdOutlineLock },
    ]

    return (
        <>
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {stats.map((s) => (
                    <Link key={s.key} href={status === s.key ? "/p-admin/tickets" : `/p-admin/tickets?status=${s.key}`} aria-pressed={status === s.key}
                        className={`admin-card flex items-center gap-4 p-4 transition hover:-translate-y-0.5 hover:shadow-md ${status === s.key ? "!border-brown ring-2 ring-brown/20" : ""}`}>
                        <span className={`admin-icon ${s.key === "Open" && s.value > 0 ? "!bg-brown !text-white" : ""}`}><s.icon /></span>
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
                                    <span className="block truncate text-xs text-muted">{t.body}</span>
                                </td>
                                <td><span className="rounded-full border border-solid border-line px-3 py-0.5 text-xs text-muted">{t.department}</span></td>
                                <td><Badge value={t.status} /></td>
                                <td className="whitespace-nowrap text-sm">
                                    <span className="block text-fg">{timeAgo(t.updatedAt)}</span>
                                    <span className="block text-xs text-muted">{t.replyCount ?? 0} {t.replyCount === 1 ? "reply" : "replies"}</span>
                                </td>
                                <td className="text-end">
                                    <Link href={`/p-admin/tickets/${t._id}`} className={`inline-flex h-8 items-center rounded-full border border-solid px-4 text-xs font-medium ${waiting ? "border-brown bg-brown !text-white hover:brightness-110" : "border-line bg-surface text-fg hover:bg-soft"}`}>{waiting ? "Reply" : "View"}</Link>
                                </td>
                            </tr>
                        )
                    })}
                    <TableState colSpan={6} isLoading={isLoading} isError={isError} isEmpty={!tickets.length} emptyText={`No tickets ${status ? `marked ${status.toLowerCase()}` : "match"}.`}
                        hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} />
                </tbody>
            </Table>
        </>
    )
}
