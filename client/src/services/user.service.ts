import { emptyPage } from "./empty"
import type { ListParams, Paginated } from "@/types/api"
import type { User } from "@/types/models"
// TODO: write these.

export const getUsers = async (params: ListParams): Promise<Paginated<User>> => {
    return emptyPage(params)
}
