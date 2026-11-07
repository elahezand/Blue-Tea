import { emptyPage, emptyCursorPage } from "./empty"
import type { CursorPaginated, ListParams, Paginated } from "@/types/api"
import type { ID, Product } from "@/types/models"
// TODO: write these.

/** Products with score >= 4 for the home page. */
export const getTopProducts = async (): Promise<Product[]> => {
    return []
}

/** Store list ("load more"), filtered by params.category (category name). */
export const getProducts = async (params: ListParams): Promise<CursorPaginated<Product>> => {
    return emptyCursorPage(params)
}

export const getProductById = async (id: ID): Promise<Product | null> => {
    return null
}

/** Admin table, with category populated. */
export const getAdminProducts = async (params: ListParams): Promise<Paginated<Product>> => {
    return emptyPage(params)
}

/** _id + updatedAt of every product, for sitemap.xml */
export const getProductsForSitemap = async (): Promise<Pick<Product, "_id" | "updatedAt">[]> => {
    return []
}
