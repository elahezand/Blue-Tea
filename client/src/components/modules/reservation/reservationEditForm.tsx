"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Spinner } from "@/components/feedback/loader"
import { reservationEditSchema, type ReservationEditInput, type ReservationEditOutput } from "@/validators/reservation"
import { applyFieldErrors } from "@/utils/apiError"
import type { Reservation } from "@/types/reservation"

interface ReservationEditFormProps {
    reservation: Reservation
    isPending: boolean
    onSave: (values: ReservationEditOutput, onError: (error: unknown) => void) => void
    onCancel: () => void
}

export default function ReservationEditForm({ reservation, isPending, onSave, onCancel }: ReservationEditFormProps) {
    const { register, handleSubmit, setError, formState: { errors } } = useForm<ReservationEditInput, unknown, ReservationEditOutput>({
        resolver: zodResolver(reservationEditSchema),
        defaultValues: {
            date: String(reservation.date).slice(0, 10),
            time: reservation.time,
            guests: reservation.guests,
            notes: reservation.notes ?? "",
        },
    })
    const id = reservation._id
    const err = (k: keyof ReservationEditInput) => errors[k] && <span className="text-sm text-berry">{errors[k]?.message}</span>

    return (
        <form noValidate onSubmit={handleSubmit((values) => onSave(values, (error) => applyFieldErrors(error, setError)))} className="grid gap-3 sm:grid-cols-4">
            <div><label htmlFor={`d-${id}`} className="field-label !text-xs">Date</label><input id={`d-${id}`} type="date" {...register("date")} className="field" />{err("date")}</div>
            <div><label htmlFor={`t-${id}`} className="field-label !text-xs">Time</label><input id={`t-${id}`} type="time" step="300" min="08:00" max="23:00" {...register("time")} className="field" />{err("time")}</div>
            <div><label htmlFor={`g-${id}`} className="field-label !text-xs">Guests</label><input id={`g-${id}`} type="number" min={1} max={5} {...register("guests")} className="field" />{err("guests")}</div>
            <div className="sm:col-span-4"><label htmlFor={`n-${id}`} className="field-label !text-xs">Notes</label><textarea id={`n-${id}`} rows={2} {...register("notes")} className="field" />{err("notes")}</div>
            <div className="flex justify-end gap-2 sm:col-span-4">
                <button type="button" onClick={onCancel} className="btn-ghost !h-9">Close</button>
                <button type="submit" disabled={isPending} className="classic">{isPending ? <Spinner label="Saving" /> : "Save booking"}</button>
            </div>
        </form>
    )
}
