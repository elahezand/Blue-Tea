import { emptyPage } from "./empty"
import type { ListParams, Paginated } from "@/types/api"
import type { Contact } from "@/types/models"
// TODO: write these.

export const getAdminContacts = async (params: ListParams): Promise<Paginated<Contact>> => {
    return emptyPage(params)
}
