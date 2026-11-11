import { z } from "zod"
import { phoneSchema } from "./auth"

export const reservationSchema = z.object({
    name: z.string().trim().min(2, "Enter your name").max(40, "Name cannot exceed 40 characters"),
    email: z.string().trim().email("Invalid email format"),
    phone: phoneSchema,
    date: z.string().min(1, "Pick a day"),
    time: z.string().min(1, "Pick a time"),
    guests: z.number({ message: "How many guests?" }).int().min(1, "At least 1 guest").max(5, "Tables seat up to 5"),
    notes: z.string().trim().max(300, "Notes cannot exceed 300 characters").optional(),
})

export type ReservationInput = z.infer<typeof reservationSchema>

export const reservationEditSchema = reservationSchema.pick({ date: true, time: true, guests: true, notes: true }).extend({
    guests: z.coerce.number({ message: "How many guests?" }).int().min(1, "At least 1 guest").max(5, "Tables seat up to 5"),
})

export type ReservationEditInput = z.input<typeof reservationEditSchema>
export type ReservationEditOutput = z.output<typeof reservationEditSchema>
