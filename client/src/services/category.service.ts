import { keepPreviousData, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import serverFetch from "./serverFetch"
import { revalidateCategoriesAction } from "@/actions/revalidate"
import { useDelete, useGet, useInfiniteQuery, usePost, usePut } from "@/hooks/useApi"
import { ENDPOINTS } from "@/utils/constant"
import type { ApiResponse, ID, ListParams } from "@/types/api"
import type { Category, ProductCategoryNode } from "@/types/category"

const ADMIN_CATEGORIES_KEY = ["admin", "categories"]

type CategoryResponse = ApiResponse<Category>

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
    useInfiniteQuery<Category>(ENDPOINTS.ADMIN_CATEGORIES, { limit: 100, ...params }, {
        queryKey: [...ADMIN_CATEGORIES_KEY, params],
        placeholderData: keepPreviousData,
    })

export const useGetCategory = (id?: ID) =>
    useGet<CategoryResponse, Category>(`${ENDPOINTS.CATEGORIES}/${id}`, {}, {
        queryKey: [...ADMIN_CATEGORIES_KEY, id],
        enabled: !!id,
        select: (res) => res.data,
    })

export const useCreateCategory = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient()

    return usePost<CategoryResponse, FormData>(ENDPOINTS.CATEGORIES, {
        onSuccess: () => {
            toast.success("Category created")
            queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEY })
            void revalidateCategoriesAction()
            onSuccessCallback?.()
        },
        errorFallback: "Couldn't create the category",
    })
}

export const useUpdateCategory = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient()

    return usePut<CategoryResponse, FormData>(ENDPOINTS.CATEGORIES, {
        onSuccess: () => {
            toast.success("Category saved")
            queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEY })
            void revalidateCategoriesAction()
            onSuccessCallback?.()
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
