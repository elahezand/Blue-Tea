import { cache } from "react"
import { keepPreviousData, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import serverFetch from "./serverFetch"
import { useGet, useInfiniteQuery, usePost, usePut } from "@/hooks/useApi"
import { revalidateProductsAction } from "@/actions/revalidate"
import { ApiError } from "@/utils/apiError"
import { isValidObjectId, toQueryString } from "@/utils/helper"
import { ENDPOINTS, HOME_PRODUCTS, PRODUCTS_PER_PAGE } from "@/utils/constant"
import type { ApiResponse, CursorPaginated, ListParams } from "@/types/api"
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
        const body = await serverFetch<ApiResponse<Product>>({
            endpoint: `${ENDPOINTS.PRODUCTS}/${id}`,
            cacheKey: `product-${id}`,
            revalidateTime: 60,
        })
        return body.data
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

const ADMIN_PRODUCTS_KEY = ["admin", "products"]

export const useGetProduct = (id?: string) =>
    useGet<ApiResponse<Product>, Product>(`${ENDPOINTS.PRODUCTS}/${id}`, {}, {
        queryKey: [...ADMIN_PRODUCTS_KEY, id],
        enabled: !!id,
        select: (res) => res.data,
    })

export const useCreateProduct = (onCreated?: () => void) => {
    const queryClient = useQueryClient()

    return usePost<ApiResponse<Product>, FormData>(ENDPOINTS.PRODUCTS, {
        onSuccess: () => {
            toast.success("Product created")
            queryClient.invalidateQueries({ queryKey: [ENDPOINTS.PRODUCTS] })
            queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_KEY })
            void revalidateProductsAction()
            onCreated?.()
        },
        errorFallback: "Couldn't create the product",
    })
}

export const useUpdateProduct = (onUpdated?: () => void) => {
    const queryClient = useQueryClient()

    return usePut<ApiResponse<Product>, FormData>(ENDPOINTS.PRODUCTS, {
        onSuccess: (_, { id }) => {
            toast.success("Product saved")
            queryClient.invalidateQueries({ queryKey: [ENDPOINTS.PRODUCTS] })
            queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_KEY })
            void revalidateProductsAction(id ? String(id) : undefined)
            onUpdated?.()
        },
        errorFallback: "Couldn't save the product",
    })
}

export const useGetAdminProducts = (params: ListParams = {}) =>
    useInfiniteQuery<Product>(ENDPOINTS.ADMIN_PRODUCTS, params, {
        queryKey: [...ADMIN_PRODUCTS_KEY, "list", params],
        placeholderData: keepPreviousData,
    })

export const getProductsForSitemap = async (): Promise<Pick<Product, "_id" | "updatedAt">[]> => {
    const products: Pick<Product, "_id" | "updatedAt">[] = []
    let cursor: string | null = null
    do {
        const body: CursorPaginated<Product> = await serverFetch<CursorPaginated<Product>>({
            endpoint: `${ENDPOINTS.PRODUCTS}${toQueryString({ limit: 50, cursor })}`,
            cacheKey: "products-sitemap",
            revalidateTime: 86400,
        })
        products.push(...body.data.map(({ _id, updatedAt }) => ({ _id, updatedAt })))
        cursor = body.pagination.hasMore ? body.pagination.nextCursor : null
    } while (cursor)
    return products
}