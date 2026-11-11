import { keepPreviousData, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import serverFetch from "./serverFetch"
import { useDelete, useGet, useInfiniteQuery, usePost, usePut } from "@/hooks/useApi"
import { revalidateCategoriesAction } from "@/actions/revalidate"
import { ENDPOINTS } from "@/utils/constant"
import type { ApiResponse, ListParams } from "@/types/api"
import type { Category, ProductCategoryNode } from "@/types/models"

const ADMIN_CATEGORIES_KEY = ["admin", "categories"]

export const getCategories = async (): Promise<ProductCategoryNode[]> => {
    try {
        const body = await serverFetch<ApiResponse<ProductCategoryNode[]>>({
            endpoint: ENDPOINTS.CATEGORY_TREE,
            cacheKey: "categories-tree",
            revalidateTime: 3600,
        })
        const tree = body.data ?? []
        return tree.length === 1 ? tree[0].children ?? [] : tree
    } catch {
        return []
    }
}

export const useGetAdminCategories = (params: ListParams = {}) =>
    useInfiniteQuery<Category>(ENDPOINTS.ADMIN_CATEGORIES, params, {
        queryKey: [...ADMIN_CATEGORIES_KEY, params],
        placeholderData: keepPreviousData,
    })

export const useGetCategory = (id?: string) =>
    useGet<ApiResponse<Category>, Category>(`${ENDPOINTS.CATEGORIES}/${id}`, {}, {
        queryKey: [...ADMIN_CATEGORIES_KEY, id],
        enabled: !!id,
        select: (res) => res.data,
    })

export const useCreateCategory = () => {
    const queryClient = useQueryClient()

    return usePost<ApiResponse<Category>, FormData>(ENDPOINTS.CATEGORIES, {
        onSuccess: () => {
            toast.success("Category created")
            queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEY })
            void revalidateCategoriesAction()
        },
        errorFallback: "Couldn't create the category",
    })
}

export const useUpdateCategory = () => {
    const queryClient = useQueryClient()

    return usePut<ApiResponse<Category>, FormData>(ENDPOINTS.CATEGORIES, {
        onSuccess: () => {
            toast.success("Category saved")
            queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEY })
            void revalidateCategoriesAction()
        },
        errorFallback: "Couldn't save the category",
    })
}

export const useRemoveCategory = () => {
    const queryClient = useQueryClient()

    return useDelete<unknown>(ENDPOINTS.CATEGORIES, {
        onSuccess: () => {
            toast.success("Category deleted")
            queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEY })
            void revalidateCategoriesAction()
        },
        errorFallback: "Couldn't delete the category",
    })
}