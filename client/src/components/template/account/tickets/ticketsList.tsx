"use client"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { MdOutlineSupportAgent, MdOutlineAdd } from "react-icons/md"
import Table from "@/components/modules/table/table"
import TableState from "@/components/modules/table/tableState"
import Badge from "@/components/modules/badge"
import EmptyState from "@/components/modules/emptyState"
import timeAgo from "@/components/modules/p-admin/timeAgo"
import { useGetMyTickets } from "@/services/ticket.service"
import type { TicketStatus } from "@/types/ticket"

const TABS: { key: TicketStatus | ""; label: string }[] = [
    { key: "", label: "All" },
    { key: "Answered", label: "Answered" },
    { key: "Open", label: "Waiting" },
    { key: "Closed", label: "Closed" },
]

const chip = (on: boolean) => `inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-solid px-4 py-1.5 text-sm font-medium transition-colors ${on ? "border-brown bg-brown !text-white" : "border-line bg-surface text-fg hover:border-brown/50"}`

export default function TicketsList() {
    const status = useSearchParams().get("status") ?? ""
    const tab = TABS.find((t) => t.key === status)?.key ?? ""
    const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetMyTickets(tab ? { status: tab } : {})
    const tickets = data?.items ?? []

    if (!isLoading && !tab && tickets.length === 0) {
        return <EmptyState icon={<MdOutlineSupportAgent />} title="No tickets yet" text="Problem with an order or a booking? Send us a ticket and we will answer here." href="/account/tickets/new" action="New ticket" />
    }

    return (
        <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-2 overflow-x-auto" role="group" aria-label="Show tickets">
                    {TABS.map((t) => (
                        <Link key={t.label} href={t.key ? `/account/tickets?status=${t.key}` : "/account/tickets"} scroll={false} aria-current={tab === t.key ? "true" : undefined} className={chip(tab === t.key)}>{t.label}</Link>
                    ))}
                </div>
                <Link href="/account/tickets/new" className="btn-organic inline-flex items-center gap-1 bg-brown px-5 py-2 text-sm font-medium !text-white"><MdOutlineAdd aria-hidden className="text-lg" />New ticket</Link>
            </div>
            <Table>
                <thead><tr><th>Ticket</th><th>Topic</th><th>Status</th><th>Last update</th></tr></thead>
                <tbody>
                    {tickets.map((t) => {
                        const answered = t.status === "Answered"
                        return (
                            <tr key={t._id} className={answered ? "bg-[var(--green)]/[0.07]" : ""}>
                                <td className="!max-w-[340px]">
                                    <Link href={`/account/tickets/${t._id}`} className="flex items-center gap-2 font-medium text-fg hover:text-link">
                                        {answered && <span aria-label="New reply" className="size-2 shrink-0 rounded-full bg-[var(--green)]" />}
                                        <span className="truncate">{t.subject}</span>
                                    </Link>
                                    <span className="block truncate text-xs text-muted">{t.body}</span>
                                </td>
                                <td>{t.department}</td>
                                <td><Badge value={t.status === "Open" ? "Waiting for reply" : t.status} /></td>
                                <td className="whitespace-nowrap">{timeAgo(t.updatedAt)}</td>
                            </tr>
                        )
                    })}
                    <TableState colSpan={4} isLoading={isLoading} isError={isError} isEmpty={!tickets.length} emptyText={`No ${tab === "Open" ? "waiting" : tab.toLowerCase()} tickets.`}
                        hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} />
                </tbody>
            </Table>
        </>
    )
}
