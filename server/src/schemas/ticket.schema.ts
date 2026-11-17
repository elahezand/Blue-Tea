import { z } from "zod"
import { TICKET_DEPARTMENTS, TICKET_STATUSES } from "../models/Ticket.js"
import { objectId } from "./common.schema.js"

const bodySchema = z.string().trim().min(5, "Tell us a little more, at least 5 characters").max(2000, "Message cannot exceed 2000 characters")

export const ticketSchema = z.object({
    subject: z.string().trim().min(3, "Add a short subject, at least 3 characters").max(100, "Subject cannot exceed 100 characters"),
    department: z.enum(TICKET_DEPARTMENTS, { message: "Pick a topic" }),
    body: bodySchema,
})

export const replyTicketSchema = z.object({
    parent: objectId("ticket"),
    body: z.string().trim().min(2, "Write at least a couple of words").max(2000, "Your reply cannot exceed 2000 characters"),
})

export const updateTicketSchema = ticketSchema
    .partial()
    .extend({ status: z.enum(TICKET_STATUSES).optional() })
    .refine((data) => Object.values(data).some((value) => value !== undefined), "Nothing to change")

export type TicketBody = z.infer<typeof ticketSchema>
export type ReplyTicketBody = z.infer<typeof replyTicketSchema>
export type UpdateTicketBody = z.infer<typeof updateTicketSchema>
