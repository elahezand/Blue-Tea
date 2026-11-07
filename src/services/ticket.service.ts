import { emptyPage } from "./empty"
import type { ListParams, Paginated } from "@/types/api"
import type { ID, Ticket, TicketStats, TicketWithUser } from "@/types/models"
// TODO: write these.

/** All tickets of a user, newest update first. */
export const getUserTickets = async (userId: ID): Promise<Ticket[]> => {
    return []
}

/** One ticket, only if it belongs to the user. */
export const getUserTicket = async (id: ID, userId: ID): Promise<Ticket | null> => {
    return null
}

/** Admin table, filtered by params.status, with user populated. */
export const getAdminTickets = async (params: ListParams): Promise<Paginated<TicketWithUser>> => {
    return emptyPage(params)
}

export const getTicketStats = async (): Promise<TicketStats> => {
    return { open: 0, answered: 0, closed: 0 }
}

/** One ticket with user (name, email) populated. */
export const getTicketById = async (id: ID): Promise<TicketWithUser | null> => {
    return null
}
