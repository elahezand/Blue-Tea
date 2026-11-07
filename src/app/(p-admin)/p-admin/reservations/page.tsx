import type { RouteProps } from "@/types/api"
import React from 'react'
import TableToolbar from '@/components/modules/p-admin/TableToolbar'
import { reservationFilters } from '@/components/modules/p-admin/tableFilters'
import Table from '@/components/modules/table/Table'
import Badge from "@/components/modules/badge"
import Pagination from '@/components/modules/pagination/pagination'
import { getAdminReservations } from '@/services/reservation.service';
import { Person, Chip, Actions, actGhost, actDanger, day } from '@/components/modules/p-admin/cells'

export default async function page({ searchParams }: Pick<RouteProps, "searchParams">) {
    const paginatedData = await getAdminReservations(await searchParams)
    const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0)

    return (
        <>
            <Table title={"All Reservations"} toolbar={<TableToolbar fields={reservationFilters} />}>
                <thead>
                    <tr>
                        <th>When</th>
                        <th>Guest</th>
                        <th>Party</th>
                        <th>Notes</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.data.map((r) => {
                        const d = r.date ? new Date(r.date) : null
                        const isToday = d && d.toDateString() === new Date().toDateString()
                        const past = d && d < startOfToday
                        const note = r.notes || r.note || r.message
                        return (
                            <tr key={r._id} className={isToday ? "bg-brown/[0.05]" : past ? "opacity-70" : ""}>
                                <td className="whitespace-nowrap">
                                    <span className="flex items-center gap-2 font-medium text-fg">{day(r.date)}{isToday && <Chip tone="brand">Today</Chip>}</span>
                                    <span className="block text-sm text-muted">{r.time}</span>
                                </td>
                                <td className="!max-w-[240px]"><Person name={r.name} sub={r.email || r.phone} /></td>
                                <td className="whitespace-nowrap"><span className="font-medium text-fg">{r.guests}</span> <span className="text-sm text-muted">{Number(r.guests) === 1 ? "guest" : "guests"}</span></td>
                                <td className="!max-w-[220px]" title={note || undefined}>{note ? <span className="text-sm text-muted">{note}</span> : <span className="text-muted">-</span>}</td>
                                <td><Badge value={r.status} /></td>
                                <td>
                                    <Actions>
                                        <button type="button" className={actGhost}>Edit</button>
                                        <button type="button" className={actDanger}>Remove</button>
                                    </Actions>
                                </td>
                            </tr>
                        )
                    })}
                    {paginatedData.data.length === 0 && <tr><td colSpan={6} className="!py-10 text-center text-muted">No reservations match.</td></tr>}
                </tbody>
            </Table>
            <Pagination
                href={`reservations?`}
                currentPage={paginatedData.page}
                pageCount={paginatedData.pageCount}
                limit={paginatedData.limit}
            />
        </>
    )

}
