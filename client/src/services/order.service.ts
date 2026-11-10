import { emptyPage } from "./empty"
import type { ListParams, Paginated } from "@/types/api"
import type { ID, Order, OrderWithUser } from "@/types/models"
// TODO: write these.

/** Admin table, with user populated. */
export const getAdminOrders = async (params: ListParams): Promise<Paginated<OrderWithUser>> => {
    return emptyPage(params)
}

export const getOrderById = async (id: ID): Promise<Order | null> => {
    return null
}
