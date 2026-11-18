import { keepPreviousData, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useInfiniteQuery, usePost ,useDelete} from "@/hooks/useApi"
import { ADMIN_PER_PAGE, ENDPOINTS } from "@/utils/constant"
import type { ApiResponse, ListParams } from "@/types/api"
import type { Contact, ReplyContactBody } from "@/types/contact"
import type { ContactInput } from "@/validators/contact"

const CONTACTS_KEY = ["contacts"]
const ADMIN_CONTACTS_KEY = ["admin", "contacts"]
const ADMIN_DASHBOARD_KEY = ["admin", "dashboard"]

type ContactResponse = ApiResponse<Contact>

export const useSendMessage = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient()

    return usePost<ContactResponse, ContactInput>(ENDPOINTS.CONTACTS, {
        onSuccess: () => {
            toast.success("Thanks! We will reply within a day")
            queryClient.invalidateQueries({ queryKey: CONTACTS_KEY })
            onSuccessCallback?.()
        },
        errorFallback: "Couldn't send your message",
    })
}
export const useGetAdminContacts = (params: ListParams = {}) =>
    useInfiniteQuery<Contact>(ENDPOINTS.ADMIN_CONTACTS, { limit: ADMIN_PER_PAGE, ...params }, {
        queryKey: [...ADMIN_CONTACTS_KEY, params],
        placeholderData: keepPreviousData,
    })

export const useReplyContact = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient()

    return usePost<ContactResponse, ReplyContactBody>(ENDPOINTS.CONTACTS_REPLY, {
        onSuccess: () => {
            toast.success("Reply sent")
            queryClient.invalidateQueries({ queryKey: ADMIN_CONTACTS_KEY })
            queryClient.invalidateQueries({ queryKey: CONTACTS_KEY })
            queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_KEY })
            onSuccessCallback?.()
        },
        errorFallback: "Couldn't send the reply",
    })
}
export const useRemoveContact = () => {
    const queryClient = useQueryClient()

    return useDelete<unknown>(ENDPOINTS.ADMIN_CONTACTS, {
        onSuccess: () => {
            toast.success("Message deleted")
            queryClient.invalidateQueries({ queryKey: ADMIN_CONTACTS_KEY })
            queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_KEY })
        },
        errorFallback: "Couldn't delete the message",
    })
}