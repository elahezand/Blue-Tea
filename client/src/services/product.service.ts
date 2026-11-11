import { cache } from "react"
import { keepPreviousData, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import serverFetch from "./serverFetch"
import { revalidateProductsAction } from "@/actions/revalidate"
import { useDelete, useGet, useInfiniteQuery, usePost, usePut } from "@/hooks/useApi"
import { ApiError } from "@/utils/apiError"
import { isValidObjectId, toQueryString } from "@/utils/helper"
import { ADMIN_PER_PAGE, ENDPOINTS, HOME_PRODUCTS, PRODUCTS_PER_PAGE } from "@/utils/constant"
import type { ApiResponse, CursorPaginated, ID, ListParams } from "@/types/api"
import type { Product, ProductQuery } from "@/types/product"

const PRODUCTS_KEY = [ENDPOINTS.PRODUCTS]
const ADMIN_PRODUCTS_KEY = ["admin", "products"]

type ProductResponse = ApiResponse<Product>

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
        const body = await serverFetch<ProductResponse>({
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

export const useGetAdminProducts = (params: ListParams = {}) =>
    useInfiniteQuery<Product>(ENDPOINTS.ADMIN_PRODUCTS, { limit: ADMIN_PER_PAGE, ...params }, {
        queryKey: [...ADMIN_PRODUCTS_KEY, "list", params],
        placeholderData: keepPreviousData,
    })

export const useGetProduct = (id?: ID) =>
    useGet<ProductResponse, Product>(`${ENDPOINTS.ADMIN_PRODUCTS}/${id}`, {}, {
        queryKey: [...ADMIN_PRODUCTS_KEY, id],
        enabled: !!id,
        select: (res) => res.data,
    })

export const useCreateProduct = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient()

    return usePost<ProductResponse, FormData>(ENDPOINTS.PRODUCTS, {
        onSuccess: () => {
            toast.success("Product created")
            queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY })
            queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_KEY })
            void revalidateProductsAction()
            onSuccessCallback?.()
        },
        errorFallback: "Couldn't create the product",
    })
}

export const useUpdateProduct = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient()

    return usePut<ProductResponse, FormData>(ENDPOINTS.PRODUCTS, {
        onSuccess: (_, { id }) => {
            toast.success("Product saved")
            queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY })
            queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_KEY })
            void revalidateProductsAction(id ? String(id) : undefined)
            onSuccessCallback?.()
        },
        errorFallback: "Couldn't save the product",
    })
}

export const useRemoveProduct = () => {
    const queryClient = useQueryClient()

    return useDelete<unknown>(ENDPOINTS.PRODUCTS, {
        onSuccess: (_, id) => {
            toast.success("Product deleted")
            queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY })
            queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_KEY })
            void revalidateProductsAction(id ? String(id) : undefined)
        },
        errorFallback: "Couldn't delete the product",
    })
}
