import { emptyPage, emptyCursorPage } from "./empty"
import type { CursorPaginated, ListParams, Paginated } from "@/types/api"
import type { Comment, CommentWithProduct, ID } from "@/types/models"
// TODO: write these.

export const getLatestComments = async (limit = 10): Promise<Comment[]> => {
    return []
}

export const getProductComments = async (productId: ID, params: ListParams): Promise<CursorPaginated<Comment>> => {
    return emptyCursorPage(params)
}

/** Admin table, with productID populated. */
export const getAdminComments = async (params: ListParams): Promise<Paginated<CommentWithProduct>> => {
    return emptyPage(params)
}
