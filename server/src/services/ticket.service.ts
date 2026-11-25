import type { FilterQuery, HydratedDocument, Types } from "mongoose"
import Ticket, { TICKET_STATUSES, type ITicket } from "../models/Ticket.js"
import type { IUser } from "../models/User.js"
import type { ListQuery } from "../schemas/common.schema.js"
import type { AdminTicketListQuery, MyTicketListQuery, ReplyTicketBody, TicketBody, UpdateTicketBody } from "../schemas/ticket.schema.js"
import { AppError } from "../utils/AppError.js"
import { buildListQuery } from "../utils/buildListQuery.js"
import { notifyAdmins, notifyUser } from "../utils/notify.js"
import { paginate } from "../utils/paginate.js"

type UserDoc = HydratedDocument<IUser>

const customer = { path: "user", select: "name email" }
const threadFilter = (id: string, userId?: Types.ObjectId): FilterQuery<ITicket> => ({
    _id: id,
    parent: null,
    ...(userId ? { user: userId } : {}),
})

const findThread = async (id: string, userId?: Types.ObjectId) => {
    const ticket = await Ticket.findOne(threadFilter(id, userId))
    if (!ticket) throw new AppError("Ticket not found", 404)
    return ticket
}

const accessibleThread = (user: UserDoc, id: string) =>
    findThread(id, user.role === "ADMIN" ? undefined : user._id)

export const create = (userId: Types.ObjectId, body: TicketBody) =>
    Ticket.create({ ...body, user: userId, author: userId, from: "user", parent: null, status: "open" })

export const listMine = (userId: Types.ObjectId, { status, limit, cursor }: MyTicketListQuery) =>
    paginate(Ticket, {
        limit,
        cursor,
        filters: buildListQuery<ITicket>({ status }, {
            base: { user: userId, parent: null },
            statuses: TICKET_STATUSES,
        }),
        sort: { lastReplyAt: -1 },
    })

const getThread = async (id: string, { limit, cursor }: ListQuery, userId?: Types.ObjectId) => {
    const ticket = await findThread(id, userId)
    const [{ data: replies, pagination }] = await Promise.all([
        paginate(Ticket, { limit, cursor, filters: { parent: ticket._id }, sort: { createdAt: 1 } }),
        userId ? Promise.resolve() : ticket.populate(customer),
    ])
    return { ticket, replies, pagination }
}

export const getMine = (userId: Types.ObjectId, id: string, query: ListQuery) => getThread(id, query, userId)

export const reply = async (user: UserDoc, { parent, body }: ReplyTicketBody) => {
    const ticket = await accessibleThread(user, parent)
    if (ticket.status === "closed") throw new AppError("This ticket is closed", 409)

    const from = user.role === "ADMIN" ? "admin" : "user"
    const message = await Ticket.create({ parent: ticket._id, user: ticket.user, author: user._id, from, body })
    try {
        const result = await Ticket.updateOne(
            { _id: ticket._id, parent: null, status: { $ne: "closed" } },
            {
                $inc: { replyCount: 1 },
                $max: { lastReplyAt: message.createdAt },
                $set: { status: from === "admin" ? "answered" : "open" },
            },
        )
        if (result.matchedCount === 0) throw new AppError("This ticket is no longer open for replies", 409)
    } catch (error) {
        await Ticket.deleteOne({ _id: message._id })
        throw error
    }

    if (from === "admin") {
        await notifyUser(ticket.user, { type: "ticket", title: "Your ticket was answered", href: `/account/tickets/${ticket._id}`, entityId: ticket._id })
    } else {
        await notifyAdmins({ type: "ticket", title: "New reply on a ticket", href: `/p-admin/tickets/${ticket._id}`, entityId: ticket._id })
    }
    return message
}

export const update = async (user: UserDoc, id: string, { status }: UpdateTicketBody) => {
    const ticket = await accessibleThread(user, id)
    if (ticket.status === status) return ticket
    ticket.status = status
    ticket.closedBy = user.role === "ADMIN" ? "admin" : "user"
    return ticket.save()
}

export const listAdmin = ({ department, status, q, preset, from, to, limit, cursor }: AdminTicketListQuery) =>
    paginate(Ticket, {
        limit,
        cursor,
        filters: buildListQuery<ITicket>({ q, status, preset, from, to }, {
            base: { parent: null },
            statuses: TICKET_STATUSES,
            search: ["subject", "body"],
            dateField: "createdAt",
            extra: department && department !== "all" ? { department } : undefined,
        }),
        sort: { lastReplyAt: -1 },
        populate: customer,
    })

export const getStats = async () => {
    const counts = await Promise.all(TICKET_STATUSES.map(status => Ticket.countDocuments({ parent: null, status })))
    const [open, answered, closed] = counts
    return { open, answered, closed }
}

export const getAdminById = (id: string, query: ListQuery) => getThread(id, query)

export const remove = async (id: string) => {
    const result = await Ticket.deleteOne(threadFilter(id))
    if (!result.deletedCount) throw new AppError("Ticket not found", 404)
    await Ticket.deleteMany({ parent: id })
}
