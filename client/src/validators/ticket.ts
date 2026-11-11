import { z } from "zod"

export const TICKET_DEPARTMENTS = ["Order", "Reservation", "Shop", "Website", "Other"] as const

export const ticketSchema = z.object({
    subject: z.string().trim().min(3, "Add a short subject, at least 3 characters").max(100, "Subject cannot exceed 100 characters"),
    department: z.enum(TICKET_DEPARTMENTS),
    body: z.string().trim().min(5, "Tell us a little more, at least 5 characters").max(2000, "Message cannot exceed 2000 characters"),
})

export type TicketInput = z.infer<typeof ticketSchema>
