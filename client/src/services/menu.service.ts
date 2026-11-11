import { keepPreviousData, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import serverFetch from "./serverFetch"
import { revalidateMenuAction } from "@/actions/revalidate"
import { useDelete, useInfiniteQuery, usePost, usePut } from "@/hooks/useApi"
import { ADMIN_PER_PAGE, ENDPOINTS } from "@/utils/constant"
import type { ApiResponse, ListParams } from "@/types/api"
import type { MenuItem, MenuSection } from "@/types/menu"

const ADMIN_MENU_KEY = ["admin", "menu"]

type MenuItemResponse = ApiResponse<MenuItem>

export const getMenu = async (): Promise<MenuSection[]> => {
    try {
        const body = await serverFetch<ApiResponse<MenuSection[]>>({
            endpoint: ENDPOINTS.MENU,
            cacheKey: "menu",
            revalidateTime: 3600,
        })
        return body.data ?? []
    } catch {
        return []
    }
}

export const useGetAdminMenu = (params: ListParams = {}) =>
    useInfiniteQuery<MenuItem>(ENDPOINTS.ADMIN_MENU, { limit: ADMIN_PER_PAGE, ...params }, {
        queryKey: [...ADMIN_MENU_KEY, params],
        placeholderData: keepPreviousData,
    })

export const useCreateMenuItem = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient()

    return usePost<MenuItemResponse, FormData>(ENDPOINTS.MENU, {
        onSuccess: () => {
            toast.success("Menu item created")
            queryClient.invalidateQueries({ queryKey: ADMIN_MENU_KEY })
            void revalidateMenuAction()
            onSuccessCallback?.()
        },
        errorFallback: "Couldn't create the menu item",
    })
}

export const useUpdateMenuItem = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient()

    return usePut<MenuItemResponse, FormData>(ENDPOINTS.MENU, {
        onSuccess: () => {
            toast.success("Menu item saved")
            queryClient.invalidateQueries({ queryKey: ADMIN_MENU_KEY })
            void revalidateMenuAction()
            onSuccessCallback?.()
        },
        errorFallback: "Couldn't save the menu item",
    })
}

export const useRemoveMenuItem = () => {
    const queryClient = useQueryClient()

    return useDelete<unknown>(ENDPOINTS.MENU, {
        onSuccess: () => {
            toast.success("Menu item deleted")
            queryClient.invalidateQueries({ queryKey: ADMIN_MENU_KEY })
            void revalidateMenuAction()
        },
        errorFallback: "Couldn't delete the menu item",
    })
}
