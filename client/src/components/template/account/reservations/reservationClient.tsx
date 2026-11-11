"use client"
import React, { useState } from "react"
import swal from "@/components/modules/swal"
import Badge from "@/components/modules/badge"
import Table from "@/components/modules/table/table"
import TableState from "@/components/modules/table/tableState"
import ReservationEditForm from "@/components/modules/reservation/reservationEditForm"
import { useCancelMyReservation, useGetMyReservations, useUpdateMyReservation } from "@/services/reservation.service"
import type { ID } from "@/types/api"

export default function ReservationClient() {
    const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetMyReservations()
    const [open, setOpen] = useState<ID | null>(null)
    const { mutate: update, isPending: saving } = useUpdateMyReservation(() => setOpen(null))
    const { mutate: cancel, isPending: canceling } = useCancelMyReservation()
    const reservations = data?.items ?? []
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const confirmCancel = (id: ID) => swal({ title: "Cancel this booking?", icon: "warning", buttons: ["No", "Yes, cancel"] })
        .then((ok) => { if (ok) cancel({ id }) })

    return (
        <Table>
            <thead>
                <tr><th>Date</th><th>Time</th><th>Guests</th><th>Status</th><th>Notes</th><th><span className="sr-only">Actions</span></th></tr>
            </thead>
            <tbody>
                {reservations.map((r) => {
                    const upcoming = new Date(r.date) >= startOfToday && r.status !== "Cancelled"
                    const isOpen = open === r._id
                    return (
                        <React.Fragment key={r._id}>
                            <tr>
                                <td className="whitespace-nowrap">{String(r.date).slice(0, 10)}</td>
                                <td>{r.time}</td>
                                <td>{r.guests}</td>
                                <td><Badge value={r.status} /></td>
                                <td className="!max-w-[200px] text-sm text-muted">{r.notes || "-"}</td>
                                <td>
                                    {upcoming && (
                                        <div className="flex justify-end gap-2">
                                            <button type="button" onClick={() => setOpen(isOpen ? null : r._id)} className="btn-ghost !h-8 !px-3 text-xs">{isOpen ? "Close" : "Edit"}</button>
                                            <button type="button" disabled={canceling} onClick={() => confirmCancel(r._id)} className="btn-ghost !h-8 !px-3 text-xs !text-berry">Cancel</button>
                                        </div>
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
                <TableState colSpan={6} isLoading={isLoading} isError={isError} isEmpty={!reservations.length} emptyText="No reservations yet."
                    hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} />
            </tbody>
        </Table>
    )
}
