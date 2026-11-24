"use client"
import React, { useEffect, useState } from "react"
import swal from "@/components/modules/swal"
import Badge from "@/components/modules/badge"
import Table from "@/components/modules/table/table"
import TableState from "@/components/modules/table/tableState"
import ReservationEditForm from "@/components/modules/reservation/reservationEditForm"
import { reservationCancellationOpen, reservationLocalTime } from "@/components/modules/shopInfo"
import { useCancelMyReservation, useGetMyReservations, useUpdateMyReservation } from "@/services/reservation.service"
import type { ID } from "@/types/api"
import { isReservationStatus, RESERVATION_STATUS_LABELS, type ReservationStatus } from "@/types/reservation"

export default function ReservationClient() {
    const [status, setStatus] = useState<ReservationStatus | undefined>()
    const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetMyReservations({ status })
    const [open, setOpen] = useState<ID | null>(null)
    const [now, setNow] = useState(() => Date.now())
    useEffect(() => {
        const timer = window.setInterval(() => setNow(Date.now()), 30_000)
        return () => window.clearInterval(timer)
    }, [])
    const { mutate: update, isPending: saving } = useUpdateMyReservation(() => setOpen(null))
    const { mutate: cancel, isPending: canceling } = useCancelMyReservation()
    const reservations = data?.items ?? []
    const local = reservationLocalTime(new Date(now))

    const confirmCancel = (id: ID) => swal({ title: "Cancel this booking?", icon: "warning", buttons: ["No", "Yes, cancel"] })
        .then((ok) => { if (ok) cancel({ id }) })

    return (
        <Table toolbar={(
            <div className="max-w-xs">
                <label htmlFor="my-reservation-status" className="field-label">Status</label>
                <select id="my-reservation-status" className="field" value={status ?? ""} onChange={(event) => {
                    const value = event.target.value
                    setOpen(null)
                    setStatus(isReservationStatus(value) ? value : undefined)
                }}>
                    <option value="">All statuses</option>
                    {Object.entries(RESERVATION_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
            </div>
        )}>
            <thead>
                <tr><th>Date</th><th>Time</th><th>Guests</th><th>Status</th><th>Notes</th><th><span className="sr-only">Actions</span></th></tr>
            </thead>
            <tbody>
                {reservations.map((r) => {
                    const active = r.status === "pending" || r.status === "confirmed"
                    const upcoming = active && (r.startsAt
                        ? Date.parse(r.startsAt) > now
                        : r.date > local.date || (r.date === local.date && r.time > local.time))
                    const canCancel = upcoming && reservationCancellationOpen(r, now)
                    const isOpen = open === r._id
                    return (
                        <React.Fragment key={r._id}>
                            <tr>
                                <td className="whitespace-nowrap">{String(r.date).slice(0, 10)}</td>
                                <td>{r.time}</td>
                                <td>{r.guests}</td>
                                <td><Badge value={RESERVATION_STATUS_LABELS[r.status] ?? "Archived"} /></td>
                                <td className="!max-w-[200px] text-sm text-muted">{r.notes || "-"}</td>
                                <td>
                                    {upcoming && (
                                        <div className="flex justify-end gap-2">
                                            <button type="button" onClick={() => setOpen(isOpen ? null : r._id)} className="btn-ghost !h-8 !px-3 text-xs">{isOpen ? "Close" : "Edit"}</button>
                                            {canCancel
                                                ? <button type="button" disabled={canceling} onClick={() => confirmCancel(r._id)} className="btn-ghost !h-8 !px-3 text-xs !text-berry">Cancel</button>
                                                : <span className="self-center text-xs text-muted" title="Cancel up to 3 hours before your reservation starts">Cancellation closed</span>}
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
                <TableState colSpan={6} isLoading={isLoading} isError={isError} isEmpty={!reservations.length} emptyText={status ? "No reservations match this status." : "No reservations yet."}
                    hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} />
            </tbody>
        </Table>
    )
}
