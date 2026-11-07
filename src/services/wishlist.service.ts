import type { CursorPaginated, ListParams } from "@/types/api"
import type { ID, Product } from "@/types/models"
// TODO: write these.

/** Saved products of a user. null when the user has no wishlist yet. */
export const getWishlistProducts = async (userId: ID, params: ListParams): Promise<CursorPaginated<Product> | null> => {
    return null
}
