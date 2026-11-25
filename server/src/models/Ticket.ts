import { Schema, model, type Types } from "mongoose"
import { notifyAdmins, notifyUser } from "../utils/notify.js"

export const TICKET_STATUSES = ["open", "answered", "closed"] as const
export const TICKET_DEPARTMENTS = ["Order", "Reservation", "Shop", "Website", "Other"] as const

export type TicketStatus = (typeof TICKET_STATUSES)[number]
export type TicketDepartment = (typeof TICKET_DEPARTMENTS)[number]

export interface ITicket {
    user: Types.ObjectId
    author: Types.ObjectId
    parent: Types.ObjectId | null
    from: "user" | "admin"
    subject?: string
    department?: TicketDepartment
    status?: TicketStatus
    body: string
    replyCount: number
    lastReplyAt: Date
    closedAt: Date | null
    closedBy: "user" | "admin" | null
    createdAt: Date
    updatedAt: Date
}

const isRoot = function (this: ITicket) { return !this.parent }

const ticketSchema = new Schema<ITicket>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    parent: { type: Schema.Types.ObjectId, ref: "Ticket", default: null },
    from: { type: String, enum: ["user", "admin"], default: "user" },
    subject: { type: String, trim: true, required: [isRoot, "Subject is required"] },
    department: { type: String, enum: TICKET_DEPARTMENTS, default: function (this: ITicket) { return this.parent ? undefined : "Other" } },
    status: { type: String, enum: TICKET_STATUSES, default: function (this: ITicket) { return this.parent ? undefined : "open" } },
    body: { type: String, required: true, trim: true },
    replyCount: { type: Number, default: 0 },
    lastReplyAt: { type: Date, default: Date.now },
    closedAt: { type: Date, default: null },
    closedBy: { type: String, enum: ["user", "admin", null], default: null },
}, { timestamps: true, versionKey: false })

ticketSchema.index({ parent: 1, createdAt: 1 })
ticketSchema.index({ user: 1, parent: 1, lastReplyAt: -1 })
ticketSchema.index({ parent: 1, status: 1, lastReplyAt: -1 })

ticketSchema.pre("validate", function () {
    if (this.parent || this.isNew || !this.isModified("status")) return
    if (this.status === "closed") {
        this.closedAt = new Date()
    } else {
        this.closedAt = null
        this.closedBy = null
    }
})

ticketSchema.pre("save", function () {
    this.$locals.wasNew = this.isNew
    this.$locals.closed = !this.isNew && !this.parent && this.isModified("status") && this.status === "closed"
})

ticketSchema.post("save", async function (doc) {
    if (doc.$locals.closed && doc.closedBy === "admin") {
        await notifyUser(doc.user, { type: "ticket", title: "Your ticket was closed", text: doc.subject, href: `/account/tickets/${doc._id}`, entityId: doc._id })
        return
    }
    if (doc.$locals.wasNew && !doc.parent) {
        await notifyAdmins({ type: "ticket", title: "New ticket", text: doc.subject, href: `/p-admin/tickets/${doc._id}`, entityId: doc._id })
    }
})

const Ticket = model<ITicket>("Ticket", ticketSchema)

export default Ticket
