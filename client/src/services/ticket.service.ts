import { useInfiniteQuery as useTanstackInfiniteQuery, useQueryClient, type QueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useDelete, useGet, useInfiniteQuery, usePost, usePut } from "@/hooks/useApi"
import { ACCOUNT_PER_PAGE, ADMIN_PER_PAGE, ENDPOINTS } from "@/utils/constant"
import type { ApiResponse, CursorPagination, ID } from "@/types/api"
import type { AdminTicketFilters, CreateTicketBody, MyTicketFilters, ReplyTicketBody, Ticket, TicketStats, TicketWithUser, UpdateTicketBody } from "@/types/ticket"
import http from "@/services/http"

const TICKETS_KEY = ["tickets"]
const ADMIN_TICKETS_KEY = ["admin", "tickets"]

type TicketResponse = ApiResponse<Ticket>

const refreshTickets = (client: QueryClient) => Promise.all([
    client.invalidateQueries({ queryKey: TICKETS_KEY }),
    client.invalidateQueries({ queryKey: ADMIN_TICKETS_KEY }),
    client.invalidateQueries({ queryKey: ["dashboard", "me"] }),
    client.invalidateQueries({ queryKey: ["admin", "dashboard"] }),
])

export const useGetMyTickets = (params: MyTicketFilters = {}) =>
    useInfiniteQuery<Ticket>(ENDPOINTS.MY_TICKETS, { limit: ACCOUNT_PER_PAGE, ...params }, {
        queryKey: [...TICKETS_KEY, "me", params],
    })

export const useGetTicketThread = (id: ID, isAdmin: boolean) =>
    useTanstackInfiniteQuery({
        queryKey: [...(isAdmin ? ADMIN_TICKETS_KEY : TICKETS_KEY), "thread", id],
        initialPageParam: null as string | null,
        queryFn: async ({ pageParam, signal }) => {
            const endpoint = isAdmin ? ENDPOINTS.ADMIN_TICKETS : ENDPOINTS.MY_TICKETS
            const { data } = await http.get<ApiResponse<{
                ticket: Ticket | TicketWithUser
                replies: Ticket[]
                pagination: CursorPagination
            }>>(`${endpoint}/${id}`, { params: { limit: 50, cursor: pageParam }, signal })
            return data.data
        },
        getNextPageParam: (page) => page?.pagination.nextCursor ?? undefined,
    })

export const useCreateTicket = (onSuccessCallback?: (ticket: Ticket) => void) => {
    const queryClient = useQueryClient()

    return usePost<TicketResponse, CreateTicketBody>(ENDPOINTS.TICKETS, {
        onSuccess: ({ data }) => {
            toast.success("Your ticket is sent")
            void refreshTickets(queryClient)
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
            void refreshTickets(queryClient)
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
            void refreshTickets(queryClient)
            onSuccessCallback?.()
        },
        errorFallback: "Couldn't save the ticket",
    })
}

export const useGetAdminTickets = (params: AdminTicketFilters = {}) =>
    useInfiniteQuery<TicketWithUser>(ENDPOINTS.ADMIN_TICKETS, { limit: ADMIN_PER_PAGE, ...params }, {
        queryKey: [...ADMIN_TICKETS_KEY, params],
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
            void refreshTickets(queryClient)
            onSuccessCallback?.()
        },
        errorFallback: "Couldn't delete the ticket",
    })
}
