import { keepPreviousData, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useDelete, useGet, useInfiniteQuery, usePost, usePut } from "@/hooks/useApi"
import { ACCOUNT_PER_PAGE, ADMIN_PER_PAGE, ENDPOINTS } from "@/utils/constant"
import type { ApiResponse, ID, ListParams } from "@/types/api"
import type { CreateTicketBody, ReplyTicketBody, Ticket, TicketStats, TicketWithUser, UpdateTicketBody } from "@/types/ticket"

const TICKETS_KEY = ["tickets"]
const ADMIN_TICKETS_KEY = ["admin", "tickets"]

type TicketResponse = ApiResponse<Ticket>

export const useGetMyTickets = (params: ListParams = {}) =>
    useInfiniteQuery<Ticket>(ENDPOINTS.MY_TICKETS, { limit: ACCOUNT_PER_PAGE, ...params }, {
        queryKey: [...TICKETS_KEY, "me", params],
        placeholderData: keepPreviousData,
    })

export const useGetMyTicket = (id?: ID) =>
    useGet<TicketResponse, Ticket>(`${ENDPOINTS.MY_TICKETS}/${id}`, {}, {
        queryKey: [...TICKETS_KEY, "me", id],
        enabled: !!id,
        select: (res) => res.data,
    })

export const useGetTicketReplies = (id?: ID) =>
    useInfiniteQuery<Ticket>(`${ENDPOINTS.TICKETS}/${id}/replies`, { limit: 50 }, {
        queryKey: [...TICKETS_KEY, "replies", id],
        enabled: !!id,
    })

export const useCreateTicket = (onSuccessCallback?: (ticket: Ticket) => void) => {
    const queryClient = useQueryClient()

    return usePost<TicketResponse, CreateTicketBody>(ENDPOINTS.TICKETS, {
        onSuccess: ({ data }) => {
            toast.success("Your ticket is sent")
            queryClient.invalidateQueries({ queryKey: TICKETS_KEY })
            queryClient.invalidateQueries({ queryKey: ADMIN_TICKETS_KEY })
            if (data) onSuccessCallback?.(data)
        },
        errorFallback: "Couldn't send your ticket",
    })
}

export const useReplyTicket = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient()

    return usePost<TicketResponse, ReplyTicketBody>(ENDPOINTS.TICKETS_REPLY, {
        onSuccess: () => {
            toast.success("Reply sent")
            queryClient.invalidateQueries({ queryKey: TICKETS_KEY })
            queryClient.invalidateQueries({ queryKey: ADMIN_TICKETS_KEY })
            onSuccessCallback?.()
        },
        errorFallback: "Couldn't send the reply",
    })
}

export const useUpdateTicket = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient()

    return usePut<TicketResponse, UpdateTicketBody>(ENDPOINTS.TICKETS, {
        onSuccess: () => {
            toast.success("Ticket saved")
            queryClient.invalidateQueries({ queryKey: TICKETS_KEY })
            queryClient.invalidateQueries({ queryKey: ADMIN_TICKETS_KEY })
            onSuccessCallback?.()
        },
        errorFallback: "Couldn't save the ticket",
    })
}

export const useGetAdminTickets = (params: ListParams = {}) =>
    useInfiniteQuery<TicketWithUser>(ENDPOINTS.ADMIN_TICKETS, { limit: ADMIN_PER_PAGE, ...params }, {
        queryKey: [...ADMIN_TICKETS_KEY, params],
        placeholderData: keepPreviousData,
    })

export const useGetAdminTicket = (id?: ID) =>
    useGet<ApiResponse<TicketWithUser>, TicketWithUser>(`${ENDPOINTS.ADMIN_TICKETS}/${id}`, {}, {
        queryKey: [...ADMIN_TICKETS_KEY, id],
        enabled: !!id,
        select: (res) => res.data,
    })

export const useGetTicketStats = () =>
    useGet<ApiResponse<TicketStats>, TicketStats>(ENDPOINTS.ADMIN_TICKET_STATS, {}, {
        queryKey: [...ADMIN_TICKETS_KEY, "stats"],
        select: (res) => res.data,
    })

export const useRemoveTicket = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient()

    return useDelete<unknown>(ENDPOINTS.TICKETS, {
        onSuccess: () => {
            toast.success("Ticket deleted")
            queryClient.invalidateQueries({ queryKey: TICKETS_KEY })
            queryClient.invalidateQueries({ queryKey: ADMIN_TICKETS_KEY })
            onSuccessCallback?.()
        },
        errorFallback: "Couldn't delete the ticket",
    })
}
