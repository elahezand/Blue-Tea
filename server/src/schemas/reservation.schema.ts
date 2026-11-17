import { z } from "zod"
import { dateOnly, emailSchema, optional, phoneSchema } from "./common.schema.js"

const today = () => new Date().toISOString().slice(0, 10)

const dateSchema = dateOnly.refine((value) => value >= today(), "Pick a day from today on")
const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Pick a time")
const guestsSchema = z.coerce.number({ message: "How many guests?" }).int().min(1, "At least 1 guest").max(5, "Tables seat up to 5")
const notesSchema = optional(z.string().trim().max(300, "Notes cannot exceed 300 characters"))

export const reservationSchema = z.object({
    name: z.string().trim().min(2, "Enter your name").max(40, "Name cannot exceed 40 characters"),
    email: emailSchema,
    phone: phoneSchema,
    date: dateSchema,
    time: timeSchema,
    guests: guestsSchema,
    notes: notesSchema,
})

export const updateReservationSchema = z
    .object({ date: dateSchema, time: timeSchema, guests: guestsSchema, notes: notesSchema })
    .partial()

export const adminUpdateReservationSchema = updateReservationSchema.extend({
    status: optional(z.enum(["pending", "confirmed", "completed", "no_show"])),
})

export const cancelReservationSchema = z.object({
    reason: z.string().trim().min(3, "Write a reason, at least 3 characters").max(300),
})

export type ReservationBody = z.infer<typeof reservationSchema>
export type UpdateReservationBody = z.infer<typeof updateReservationSchema>
export type AdminUpdateReservationBody = z.infer<typeof adminUpdateReservationSchema>
export type CancelReservationBody = z.infer<typeof cancelReservationSchema>
