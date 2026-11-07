import { emptyPage } from "./empty"
import type { ListParams, Paginated } from "@/types/api"
import type { Reservation } from "@/types/models"
// TODO: write these.

export const getAdminReservations = async (params: ListParams): Promise<Paginated<Reservation>> => {
    return emptyPage(params)
}
