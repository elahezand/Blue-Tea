import { keepPreviousData, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import serverFetch from "./serverFetch"
import { useDelete, useInfiniteQuery, usePut } from "@/hooks/useApi"
import { revalidateMenuAction } from "@/actions/revalidate"
import { ENDPOINTS } from "@/utils/constant"
import type { ApiResponse, ListParams } from "@/types/api"
import type { MenuItem, MenuSection } from "@/types/models"

const ADMIN_MENU_KEY = ["admin", "menu"]

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
    useInfiniteQuery<MenuItem>(ENDPOINTS.ADMIN_MENU, params, {
        queryKey: [...ADMIN_MENU_KEY, params],
        placeholderData: keepPreviousData,
    })

export const useUpdateMenuItem = (onSaved?: () => void) => {
    const queryClient = useQueryClient()

    return usePut<ApiResponse<MenuItem>, FormData>(ENDPOINTS.MENU, {
        onSuccess: () => {
            toast.success("Menu item saved")
            queryClient.invalidateQueries({ queryKey: ADMIN_MENU_KEY })
            void revalidateMenuAction()
            onSaved?.()
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
