"use client"
import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Spinner } from "@/components/feedback/loader"
import { reservationLocalTime, reservationSlots } from "@/components/modules/shopInfo"
import { reservationEditSchema, type ReservationEditInput, type ReservationEditOutput } from "@/validators/reservation"
import { applyFieldErrors } from "@/utils/apiError"
import type { Reservation } from "@/types/reservation"

interface ReservationEditFormProps {
    reservation: Reservation
    isPending: boolean
    onSave: (values: Partial<ReservationEditOutput>, onError: (error: unknown) => void) => void
    onCancel: () => void
}

export default function ReservationEditForm({ reservation, isPending, onSave, onCancel }: ReservationEditFormProps) {
    const [now] = useState(() => reservationLocalTime(new Date()))
    const originalDate = reservation.date.slice(0, 10)
    const { register, handleSubmit, control, getValues, setValue, setError, formState: { errors, dirtyFields, isDirty } } = useForm<ReservationEditInput, unknown, ReservationEditOutput>({
        resolver: zodResolver(reservationEditSchema),
        defaultValues: {
            date: originalDate,
            time: reservation.time,
            guests: reservation.guests,
            notes: reservation.notes ?? "",
        },
    })
    const date = useWatch({ control, name: "date" })
    const slots = reservationSlots(date, now)
    if (date === originalDate && reservation.time && !slots.includes(reservation.time)) slots.unshift(reservation.time)
    const id = reservation._id
    const err = (k: keyof ReservationEditInput) => errors[k] && <span className="text-sm text-berry">{errors[k]?.message}</span>

    return (
        <form noValidate onSubmit={handleSubmit((values) => {
            const changes = {
                ...(dirtyFields.date || dirtyFields.time ? { date: values.date, time: values.time } : {}),
                ...(dirtyFields.guests ? { guests: values.guests } : {}),
                ...(dirtyFields.notes ? { notes: values.notes } : {}),
            }
            onSave(changes, (error) => applyFieldErrors(error, setError))
        })} className="grid gap-3 sm:grid-cols-4">
            <div>
                <label htmlFor={`d-${id}`} className="field-label !text-xs">Date</label>
                <input id={`d-${id}`} type="date" min={now.date} {...register("date", {
                    onChange: (event) => {
                        const nextDate = event.target.value
                        const time = getValues("time")
                        if (nextDate === originalDate && time === reservation.time) return
                        if (!reservationSlots(nextDate, now).includes(time)) setValue("time", "", { shouldDirty: true })
                    },
                })} className="field" />
                {err("date")}
            </div>
            <div>
                <label htmlFor={`t-${id}`} className="field-label !text-xs">Time</label>
                <select id={`t-${id}`} disabled={!slots.length} {...register("time")} className="field">
                    <option value="">{slots.length ? "Choose a time" : "No booking times"}</option>
                    {slots.map((time) => <option key={time} value={time}>{time}</option>)}
                </select>
                {err("time")}
            </div>
            <div><label htmlFor={`g-${id}`} className="field-label !text-xs">Guests</label><input id={`g-${id}`} type="number" min={1} max={5} {...register("guests")} className="field" />{err("guests")}</div>
            <div className="sm:col-span-4"><label htmlFor={`n-${id}`} className="field-label !text-xs">Notes</label><textarea id={`n-${id}`} rows={2} {...register("notes")} className="field" />{err("notes")}</div>
            <div className="flex justify-end gap-2 sm:col-span-4">
                <button type="button" onClick={onCancel} className="btn-ghost !h-9">Close</button>
                <button type="submit" disabled={isPending || !isDirty || !slots.length} className="classic">{isPending ? <Spinner label="Saving" /> : "Save booking"}</button>
            </div>
        </form>
    )
}
