import { keepPreviousData, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useDelete, useGet, useInfiniteQuery, usePost, usePut } from "@/hooks/useApi"
import { ENDPOINTS } from "@/utils/constant"
import type { ApiResponse, ListParams } from "@/types/api"
import type { ID, Ticket, TicketWithUser } from "@/types/models"

const TICKETS_KEY = ["tickets"]
const MY_TICKETS_KEY = ["tickets", "me"]
const ADMIN_TICKETS_KEY = ["admin", "tickets"]

type TicketResponse = ApiResponse<Ticket>

export interface CreateTicketBody {
    subject: string
    department: string
    message: string
}

export interface ReplyTicketBody {
    parent: ID
    body: string
}

export interface UpdateTicketBody {
    subject?: string
    department?: string
    body?: string
    status?: Ticket["status"]
}

export const useGetMyTickets = (enabled = true) =>
    useGet<ApiResponse<Ticket[]>, Ticket[]>(ENDPOINTS.MY_TICKETS, {}, {
        queryKey: MY_TICKETS_KEY,
        enabled,
        staleTime: 0,
        select: (res) => res.data,
    })

export const useGetMyTicket = (id?: ID) =>
    useGet<TicketResponse, Ticket>(`${ENDPOINTS.MY_TICKETS}/${id}`, {}, {
        queryKey: [...MY_TICKETS_KEY, id],
        enabled: !!id,
        select: (res) => res.data,
    })

export const useGetTicketReplies = (id?: ID) =>
    useInfiniteQuery<Ticket>(`${ENDPOINTS.TICKETS}/${id}/replies`, {}, {
        queryKey: [...TICKETS_KEY, "replies", id],
        enabled: !!id,
    })

export const useCreateTicket = (onCreated?: () => void) => {
    const queryClient = useQueryClient()

    return usePost<TicketResponse, CreateTicketBody>(ENDPOINTS.TICKETS, {
        onSuccess: () => {
            toast.success("Your ticket is sent")
            queryClient.invalidateQueries({ queryKey: TICKETS_KEY })
            onCreated?.()
        },
        errorFallback: "Couldn't send your ticket",
    })
}

export const useReplyTicket = (onSent?: () => void) => {
    const queryClient = useQueryClient()

    return usePost<TicketResponse, ReplyTicketBody>(ENDPOINTS.TICKETS_REPLY, {
        onSuccess: () => {
            toast.success("Reply sent")
            queryClient.invalidateQueries({ queryKey: TICKETS_KEY })
            queryClient.invalidateQueries({ queryKey: ADMIN_TICKETS_KEY })
            onSent?.()
        },
        errorFallback: "Couldn't send the reply",
    })
}

export const useGetAdminTickets = (params: ListParams = {}) =>
    useInfiniteQuery<TicketWithUser>(ENDPOINTS.ADMIN_TICKETS, params, {
        queryKey: [...ADMIN_TICKETS_KEY, params],
        placeholderData: keepPreviousData,
    })

export const useGetAdminTicket = (id?: ID) =>
    useGet<ApiResponse<TicketWithUser>, TicketWithUser>(`${ENDPOINTS.ADMIN_TICKETS}/${id}`, {}, {
        queryKey: [...ADMIN_TICKETS_KEY, id],
        enabled: !!id,
        select: (res) => res.data,
    })

export const useUpdateTicket = (onSaved?: () => void) => {
    const queryClient = useQueryClient()

    return usePut<TicketResponse, UpdateTicketBody>(ENDPOINTS.TICKETS, {
        onSuccess: () => {
            toast.success("Ticket saved")
            queryClient.invalidateQueries({ queryKey: ADMIN_TICKETS_KEY })
            queryClient.invalidateQueries({ queryKey: TICKETS_KEY })
            onSaved?.()
        },
        errorFallback: "Couldn't save the ticket",
    })
}

export const useRemoveTicket = () => {
    const queryClient = useQueryClient()

    return useDelete<unknown>(ENDPOINTS.TICKETS, {
        onSuccess: () => {
            toast.success("Ticket deleted")
            queryClient.invalidateQueries({ queryKey: ADMIN_TICKETS_KEY })
            queryClient.invalidateQueries({ queryKey: TICKETS_KEY })
        },
        errorFallback: "Couldn't delete the ticket",
    })
}

