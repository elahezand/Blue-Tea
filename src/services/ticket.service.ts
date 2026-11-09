import { emptyPage } from "./empty"
import { useGet } from "@/hooks/useApi"
import { ENDPOINTS } from "@/utils/constant"
import type { ListParams, Paginated } from "@/types/api"
import type { ID, Ticket, TicketStats, TicketWithUser } from "@/types/models"


const MY_TICKETS_KEY = ["tickets", "me"]

type TicketsResponse = Ticket[] | { data: Ticket[] }

export const useGetMyTickets = (enabled = true) => {
    const query = useGet<TicketsResponse>(ENDPOINTS.MY_TICKETS, {}, {
        queryKey: MY_TICKETS_KEY,
        enabled,
        staleTime: 0,
    })
    const data = query.data && !Array.isArray(query.data) ? query.data.data : query.data
    return { ...query, data }
}


export const getUserTicket = async (id: ID, userId: ID): Promise<Ticket | null> => {
    return null
}

export const getAdminTickets = async (params: ListParams): Promise<Paginated<TicketWithUser>> => {
    return emptyPage(params)
}

export const getTicketStats = async (): Promise<TicketStats> => {
    return { open: 0, answered: 0, closed: 0 }
}

export const getTicketById = async (id: ID): Promise<TicketWithUser | null> => {
    return null
}