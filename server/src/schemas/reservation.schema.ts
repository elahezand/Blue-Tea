import { z } from "zod"
import { listQuery, emailSchema, optional, phoneSchema } from "./common.schema.js"
import { RESERVATION_STATUSES } from "../models/Reservation.js"
import { isReservationDate, isReservationSlot, RESERVATION_CLOCK, reservationInstant } from "../utils/reservationTime.js"

const dateSchema = z.string().refine(isReservationDate, "Pick a valid date (YYYY-MM-DD)")
const timeSchema = z.string().regex(RESERVATION_CLOCK, "Pick a valid time")
const guestsSchema = z.coerce.number({ message: "How many guests?" }).int().min(1, "At least 1 guest").max(5, "Tables seat up to 5")
const notesSchema = z.string().trim().max(300, "Notes cannot exceed 300 characters").optional()

const validateSchedule = ({ date, time }: { date?: string; time?: string }, ctx: z.RefinementCtx) => {
    if (date === undefined && time === undefined) return
    if (date === undefined || time === undefined) {
        ctx.addIssue({
            code: "custom",
            path: [date === undefined ? "date" : "time"],
            message: "Send the date and time together",
        })
        return
    }

    if (!isReservationDate(date) || !RESERVATION_CLOCK.test(time)) return
    const startsAt = reservationInstant(date, time)
    if (!startsAt || !isReservationSlot(date, time)) {
        ctx.addIssue({ code: "custom", path: ["time"], message: "Pick a half-hour slot during café opening hours" })
    } else if (startsAt.getTime() <= Date.now()) {
        ctx.addIssue({ code: "custom", path: ["time"], message: "Pick a future time" })
    }
}

export const reservationSchema = z.object({
    name: z.string().trim().min(2, "Enter your name").max(40, "Name cannot exceed 40 characters"),
    email: emailSchema,
    phone: phoneSchema,
    date: dateSchema,
    time: timeSchema,
    guests: guestsSchema,
    notes: notesSchema,
}).superRefine(validateSchedule)

const reservationChanges = z
    .object({ date: dateSchema, time: timeSchema, guests: guestsSchema, notes: notesSchema })
    .partial()

const hasChanges = (value: Record<string, unknown>) => Object.values(value).some((field) => field !== undefined)

export const updateReservationSchema = reservationChanges
    .refine(hasChanges, "Provide at least one change")
    .superRefine(validateSchedule)

export const adminUpdateReservationSchema = reservationChanges.extend({
    status: optional(z.literal("confirmed")),
}).refine(hasChanges, "Provide at least one change").superRefine(validateSchedule)

const reservationStatusFilter = optional(z.enum(RESERVATION_STATUSES))

export const myReservationListQuery = listQuery.pick({ limit: true, cursor: true }).extend({
    status: reservationStatusFilter,
})

export const adminReservationListQuery = listQuery.extend({
    status: reservationStatusFilter,
    guests: optional(z.enum(["1-2", "3-4", "5+"])),
    from: optional(dateSchema),
    to: optional(dateSchema),
}).refine(({ from, to }) => !from || !to || from <= to, {
    path: ["to"], message: "End date must be on or after the start date",
})

export const cancelReservationSchema = z.object({
    reason: z.string().trim().min(3, "Write a reason, at least 3 characters").max(300),
})

export type ReservationBody = z.infer<typeof reservationSchema>
export type UpdateReservationBody = z.infer<typeof updateReservationSchema>
export type AdminUpdateReservationBody = z.infer<typeof adminUpdateReservationSchema>
export type AdminReservationListQuery = z.infer<typeof adminReservationListQuery>
export type MyReservationListQuery = z.infer<typeof myReservationListQuery>
export type CancelReservationBody = z.infer<typeof cancelReservationSchema>
