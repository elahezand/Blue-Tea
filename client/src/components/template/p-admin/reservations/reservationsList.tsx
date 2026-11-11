"use client"
import React, { useState } from "react"
import { useSearchParams } from "next/navigation"
import swal from "@/components/modules/swal"
import Badge from "@/components/modules/badge"
import Table from "@/components/modules/table/table"
import TableState from "@/components/modules/table/tableState"
import TableToolbar from "@/components/modules/p-admin/tableToolbar"
import ReservationEditForm from "@/components/modules/reservation/reservationEditForm"
import { reservationFilters } from "@/components/modules/p-admin/tableFilters"
import { Person, Chip, Actions, actPrimary, actGhost, actDanger, day } from "@/components/modules/p-admin/cells"
import { useCancelReservation, useGetAdminReservations, useUpdateReservation } from "@/services/reservation.service"
import type { ID } from "@/types/api"

export default function ReservationsList() {
    const params = Object.fromEntries(useSearchParams().entries())
    const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetAdminReservations(params)
    const [open, setOpen] = useState<ID | null>(null)
    const { mutate: update, isPending: saving } = useUpdateReservation(() => setOpen(null))
    const { mutate: cancel, isPending: canceling, variables: cancelVars } = useCancelReservation()
    const reservations = data?.items ?? []
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const confirmCancel = (id: ID) => swal({ title: "Cancel this booking?", icon: "warning", buttons: ["No", "Yes, cancel"] })
        .then((ok) => { if (ok) cancel({ id }) })

    return (
        <Table title="All Reservations" toolbar={<TableToolbar fields={reservationFilters} />}>
            <thead>
                <tr><th>When</th><th>Guest</th><th>Party</th><th>Notes</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
                {reservations.map((r) => {
                    const d = r.date ? new Date(r.date) : null
                    const isToday = d && d.toDateString() === new Date().toDateString()
                    const past = d && d < startOfToday
                    const cancelled = r.status === "Cancelled"
                    const isOpen = open === r._id
                    return (
                        <React.Fragment key={r._id}>
                            <tr className={isToday ? "bg-brown/[0.05]" : past || cancelled ? "opacity-70" : ""}>
                                <td className="whitespace-nowrap">
                                    <span className="flex items-center gap-2 font-medium text-fg">{day(r.date)}{isToday && <Chip tone="brand">Today</Chip>}</span>
                                    <span className="block text-sm text-muted">{r.time}</span>
                                </td>
                                <td className="!max-w-[240px]"><Person name={r.name} sub={r.email || r.phone} /></td>
                                <td className="whitespace-nowrap"><span className="font-medium text-fg">{r.guests}</span> <span className="text-sm text-muted">{Number(r.guests) === 1 ? "guest" : "guests"}</span></td>
                                <td className="!max-w-[220px]" title={r.notes || undefined}>{r.notes ? <span className="text-sm text-muted">{r.notes}</span> : <span className="text-muted">-</span>}</td>
                                <td><Badge value={r.status} /></td>
                                <td>
                                    {!cancelled && (
                                        <Actions>
                                            {r.status !== "Confirmed" && <button type="button" disabled={saving} onClick={() => update({ id: r._id, payload: { date: r.date, time: r.time, guests: r.guests, notes: r.notes, status: "Confirmed" } })} className={actPrimary}>Confirm</button>}
                                            <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : r._id)} className={actGhost}>{isOpen ? "Close" : "Edit"}</button>
                                            <button type="button" disabled={canceling && cancelVars?.id === r._id} onClick={() => confirmCancel(r._id)} className={actDanger}>Cancel</button>
                                        </Actions>
                                    )}
                                </td>
                            </tr>
                            {isOpen && (
                                <tr className="!bg-soft/30">
                                    <td colSpan={6} className="!max-w-none !whitespace-normal !px-6 !py-5">
                                        <ReservationEditForm reservation={r} isPending={saving} onCancel={() => setOpen(null)}
                                            onSave={(values, onError) => update({ id: r._id, payload: values }, { onError })} />
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    )
                })}
                <TableState colSpan={6} isLoading={isLoading} isError={isError} isEmpty={!reservations.length} emptyText="No reservations match."
                    hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} />
            </tbody>
        </Table>
    )
}
