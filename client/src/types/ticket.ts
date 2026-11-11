import type { ID } from "./api"
import type { User } from "./user"

export type TicketStatus = "Open" | "Answered" | "Closed"

export type TicketDepartment = "Order" | "Reservation" | "Shop" | "Website" | "Other"

export interface Ticket {
    _id: ID
    user: ID
    subject: string
    department: TicketDepartment
    status: TicketStatus
    body: string
    parent?: ID | null
    from?: "user" | "admin"
    replyCount?: number
    createdAt?: string
    updatedAt?: string
}

export interface TicketWithUser extends Omit<Ticket, "user"> {
    user: Pick<User, "_id" | "name" | "email"> | null
}

export interface TicketStats {
    open: number
    answered: number
    closed: number
}

export interface CreateTicketBody {
    subject: string
    department: TicketDepartment
    body: string
}

export interface ReplyTicketBody {
    parent: ID
    body: string
}

export interface UpdateTicketBody {
    subject?: string
    department?: TicketDepartment
    body?: string
    status?: TicketStatus
}
