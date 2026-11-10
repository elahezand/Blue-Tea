import { cache } from "react"
import { keepPreviousData } from "@tanstack/react-query"
import { emptyPage } from "./empty"
import serverFetch from "./serverFetch"
import { useGet, useInfiniteQuery } from "@/hooks/useApi"
import { ApiError } from "@/utils/apiError"
import { isValidObjectId, toQueryString, unwrap } from "@/utils/helper"
import { ENDPOINTS, HOME_PRODUCTS, PRODUCTS_PER_PAGE } from "@/utils/constant"
import type { CursorPaginated, ListParams, Paginated } from "@/types/api"
import type { ID, Product } from "@/types/models"

export const getHomeProducts = async (): Promise<CursorPaginated<Product> | null> => {
    try {
        return await serverFetch<CursorPaginated<Product>>({
            endpoint: `${ENDPOINTS.PRODUCTS}${toQueryString({ limit: HOME_PRODUCTS })}`,
            cacheKey: "products-home",
            revalidateTime: 600,
        })
    } catch {
        return null
    }
}

export const getProducts = async (category?: string): Promise<CursorPaginated<Product>> =>
    serverFetch<CursorPaginated<Product>>({
        endpoint: `${ENDPOINTS.PRODUCTS}${toQueryString({ category, limit: PRODUCTS_PER_PAGE })}`,
        cacheKey: "products",
        revalidateTime: 60,
    })

export const getProductById = cache(async (id: ID): Promise<Product | null> => {
    if (!isValidObjectId(id)) return null
    try {
        const body = await serverFetch<Product | { data: Product }>({
            endpoint: `${ENDPOINTS.PRODUCTS}/${id}`,
            cacheKey: `product-${id}`,
            revalidateTime: 60,
        })
        return unwrap(body)
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) return null
        throw error
    }
})

export interface ProductQuery {
    category?: string
    q?: string
    min?: string
    max?: string
    sort?: string
    limit?: number
}


export const useInfiniteProducts = (query: ProductQuery, initialPage?: CursorPaginated<Product>) =>
    useInfiniteQuery<Product>(ENDPOINTS.PRODUCTS, Object.fromEntries(Object.entries(query).filter(([, v]) => v !== "" && v != null)), {
        initialData: initialPage ? { pages: [initialPage], pageParams: [null] } : undefined,
        placeholderData: keepPreviousData, 
    })

export const useHomeProducts = (category: string, initialPage?: CursorPaginated<Product> | null) =>
    useGet<CursorPaginated<Product>>(ENDPOINTS.PRODUCTS, category ? { category, limit: HOME_PRODUCTS } : { limit: HOME_PRODUCTS }, {
        initialData: !category && initialPage ? initialPage : undefined,
        placeholderData: keepPreviousData, 
    })

export const getAdminProducts = async (params: ListParams): Promise<Paginated<Product>> => {
    return emptyPage(params)
}

export const getProductsForSitemap = async (): Promise<Pick<Product, "_id" | "updatedAt">[]> => {
    return []
}