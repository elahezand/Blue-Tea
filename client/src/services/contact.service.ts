import { keepPreviousData, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { emptyPage } from "./empty"
import { useInfiniteQuery, usePost } from "@/hooks/useApi"
import { ENDPOINTS } from "@/utils/constant"
import type { ApiResponse, ListParams, Paginated } from "@/types/api"
import type { Contact, ID } from "@/types/models"
import type { ContactInput } from "@/validators/contact"

const CONTACTS_KEY = ["contacts"]
const ADMIN_CONTACTS_KEY = ["admin", "contacts"]

export interface ReplyContactBody {
    contact: ID
    body: string
}

export const useSendMessage = (onSent?: () => void) => {
    const queryClient = useQueryClient()

    return usePost<unknown, ContactInput>(ENDPOINTS.CONTACTS, {
        onSuccess: () => {
            toast.success("Thanks! We will reply within a day.")
            queryClient.invalidateQueries({ queryKey: CONTACTS_KEY })
            onSent?.()
        },
        errorFallback: "Couldn't send your message",
    })
}

export const useGetMyContacts = (params: ListParams = {}) =>
    useInfiniteQuery<Contact>(ENDPOINTS.MY_CONTACTS, params, {
        queryKey: [...CONTACTS_KEY, "me", params],
    })

export const useGetAdminContacts = (params: ListParams = {}) =>
    useInfiniteQuery<Contact>(ENDPOINTS.ADMIN_CONTACTS, params, {
        queryKey: [...ADMIN_CONTACTS_KEY, params],
        placeholderData: keepPreviousData,
    })

export const useReplyContact = (onSent?: () => void) => {
    const queryClient = useQueryClient()

    return usePost<ApiResponse<Contact>, ReplyContactBody>(ENDPOINTS.CONTACTS_REPLY, {
        onSuccess: () => {
            toast.success("Reply sent")
            queryClient.invalidateQueries({ queryKey: ADMIN_CONTACTS_KEY })
            queryClient.invalidateQueries({ queryKey: CONTACTS_KEY })
            onSent?.()
        },
        errorFallback: "Couldn't send the reply",
    })
}

export const getAdminContacts = async (params: ListParams): Promise<Paginated<Contact>> => {
    return emptyPage(params)
}