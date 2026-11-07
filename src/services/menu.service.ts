import { emptyPage } from "./empty"
import type { ListParams, Paginated } from "@/types/api"
import type { MenuItem } from "@/types/models"
// TODO: write these.

export const getAdminMenuItems = async (params: ListParams): Promise<Paginated<MenuItem>> => {
    return emptyPage(params)
}
