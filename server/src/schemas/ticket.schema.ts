import { z } from "zod"
import { TICKET_DEPARTMENTS, TICKET_STATUSES } from "../models/Ticket.js"
import { adminListQuery, listQuery, objectId, optional } from "./common.schema.js"

const bodySchema = z.string().trim().min(5, "Tell us a little more, at least 5 characters").max(2000, "Message cannot exceed 2000 characters")

const statusFilter = optional(z.enum(["all", ...TICKET_STATUSES]))
const dateFilter = optional(z.string().date())

export const myTicketListQuery = listQuery.omit({ q: true }).extend({ status: statusFilter })

export const adminTicketListQuery = adminListQuery.pick({
    limit: true, cursor: true, q: true, preset: true,
}).extend({
    status: statusFilter,
    department: optional(z.enum(["all", ...TICKET_DEPARTMENTS])),
    from: dateFilter,
    to: dateFilter,
}).refine(({ from, to }) => !from || !to || from <= to, {
    path: ["to"],
    message: "End date must be on or after the start date",
})

export type MyTicketListQuery = z.infer<typeof myTicketListQuery>
export type AdminTicketListQuery = z.infer<typeof adminTicketListQuery>

export const ticketSchema = z.object({
    subject: z.string().trim().min(3, "Add a short subject, at least 3 characters").max(100, "Subject cannot exceed 100 characters"),
    department: z.enum(TICKET_DEPARTMENTS, { message: "Pick a topic" }),
    body: bodySchema,
})

export const replyTicketSchema = z.object({
    parent: objectId("ticket"),
    body: z.string().trim().min(2, "Write at least a couple of words").max(2000, "Your reply cannot exceed 2000 characters"),
})

export const updateTicketSchema = z.object({ status: z.literal("closed") }).strict()

export type TicketBody = z.infer<typeof ticketSchema>
export type ReplyTicketBody = z.infer<typeof replyTicketSchema>
export type UpdateTicketBody = z.infer<typeof updateTicketSchema>
