import toast from "react-hot-toast"
import { emptyPage } from "./empty"
import { usePost } from "@/hooks/useApi"
import { ENDPOINTS } from "@/utils/constant"
import type { ListParams, Paginated } from "@/types/api"
import type { Contact } from "@/types/models"
import type { ContactInput } from "@/validators/contact"

export const useSendMessage = (onSent?: () => void) =>
    usePost<unknown, ContactInput>(ENDPOINTS.CONTACTS, {
        onSuccess: () => {
            toast.success("Thanks! We will reply within a day.")
            onSent?.()
        },
        errorFallback: "Couldn't send your message",
    })

export const getAdminContacts = async (params: ListParams): Promise<Paginated<Contact>> => {
    return emptyPage(params)
}