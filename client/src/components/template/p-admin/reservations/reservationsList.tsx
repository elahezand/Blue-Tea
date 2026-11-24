"use client"
import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import toast from "react-hot-toast"
import swal from "@/components/modules/swal"
import Badge from "@/components/modules/badge"
import Table from "@/components/modules/table/table"
import TableState from "@/components/modules/table/tableState"
import TableToolbar from "@/components/modules/p-admin/tableToolbar"
import ReservationEditForm from "@/components/modules/reservation/reservationEditForm"
import { reservationCancellationOpen, reservationLocalTime } from "@/components/modules/shopInfo"
import { reservationFilters } from "@/components/modules/p-admin/tableFilters"
import { Person, Chip, Actions, actGhost, day } from "@/components/modules/p-admin/cells"
import { useCancelReservation, useGetAdminReservations, useUpdateReservation } from "@/services/reservation.service"
import type { ID } from "@/types/api"
import { isReservationStatus, RESERVATION_STATUS_LABELS } from "@/types/reservation"

export default function ReservationsList() {
    const query = useSearchParams()
    const status = query.get("status")
    const params = {
        q: query.get("q") || undefined,
        status: isReservationStatus(status) ? status : undefined,
        guests: query.get("guests") || undefined,
        from: query.get("from") || undefined,
        to: query.get("to") || undefined,
    }
    const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetAdminReservations(params)
    const [open, setOpen] = useState<ID | null>(null)
    const { mutate: update, isPending: saving } = useUpdateReservation(() => setOpen(null))
    const { mutate: cancel, isPending: canceling } = useCancelReservation()
    const reservations = data?.items ?? []
    const [now, setNow] = useState(() => Date.now())
    useEffect(() => {
        const timer = window.setInterval(() => setNow(Date.now()), 30_000)
        return () => window.clearInterval(timer)
    }, [])
    const local = reservationLocalTime(new Date(now))

    const confirmCancel = async (id: ID) => {
        const reason = await swal({ title: "Why are you canceling this booking?", content: "input", buttons: ["Keep booking", "Cancel booking"] })
        if (typeof reason !== "string") return
        if (reason.length < 3 || reason.length > 300) {
            toast.error("Enter a reason between 3 and 300 characters.")
            return
        }
        cancel({ id, payload: { reason } })
    }

    return (
        <Table title="All Reservations" toolbar={<TableToolbar fields={reservationFilters} />}>
            <thead>
                <tr><th>When</th><th>Guest</th><th>Party</th><th>Notes</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
                {reservations.map((r) => {
                    const isToday = r.date === local.date
                    const past = r.startsAt
                        ? Date.parse(r.startsAt) <= now
                        : r.date < local.date || (isToday && r.time <= local.time)
                    const active = r.status === "pending" || r.status === "confirmed"
                    const canCancel = active && reservationCancellationOpen(r, now)
                    const canConfirm = r.status === "pending" && !past
                    const isOpen = open === r._id
                    return (
                        <React.Fragment key={r._id}>
                            <tr className={isToday ? "bg-brown/[0.05]" : past || !active ? "opacity-70" : ""}>
                                <td className="whitespace-nowrap">
                                    <span className="flex items-center gap-2 font-medium text-fg">{day(r.date)}{isToday && <Chip tone="brand">Today</Chip>}</span>
                                    <span className="block text-sm text-muted">{r.time}</span>
                                </td>
                                <td className="!max-w-[240px]"><Person name={r.name} sub={r.email || r.phone} /></td>
                                <td className="whitespace-nowrap"><span className="font-medium text-fg">{r.guests}</span> <span className="text-sm text-muted">{Number(r.guests) === 1 ? "guest" : "guests"}</span></td>
                                <td className="!max-w-[220px]" title={r.notes || undefined}>{r.notes ? <span className="text-sm text-muted">{r.notes}</span> : <span className="text-muted">-</span>}</td>
                                <td>
                                    <div className="flex min-w-40 flex-col items-start gap-2">
                                        <Badge value={RESERVATION_STATUS_LABELS[r.status] ?? "Archived"} />
                                        {(canCancel || canConfirm) && (
                                            <select className="field field-sm" aria-label={`Change status for ${r.name}'s reservation`}
                                                value="" disabled={saving || canceling}
                                                onChange={(event) => {
                                                    const next = event.target.value
                                                    if (next === "canceled") void confirmCancel(r._id)
                                                    else if (next === "confirmed") {
                                                        update({ id: r._id, payload: { status: next } })
                                                    }
                                                }}>
                                                <option value="" disabled>Change status</option>
                                                {canConfirm && <option value="confirmed">Confirm</option>}
                                                {canCancel && <option value="canceled">Cancel booking</option>}
                                            </select>
                                        )}
                                        {active && !canCancel && <span className="text-xs text-muted">Cancellation closed</span>}
                                    </div>
                                </td>
                                <td>
                                    {active && (
                                        <Actions>
                                            <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : r._id)} className={actGhost}>{isOpen ? "Close" : "Edit"}</button>
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
