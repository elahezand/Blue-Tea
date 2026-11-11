import { useInfiniteQuery } from "@/hooks/useApi"
import { ENDPOINTS } from "@/utils/constant"
import type { ListParams } from "@/types/api"
import type {Notification } from "@/types/models"

const REFRESH_MS = 60 * 1000

export const useGetMyNotifications = (params: ListParams = {}) =>
    useInfiniteQuery<Notification>(ENDPOINTS.MY_NOTIFICATIONS, params, {
        queryKey: ["notifications", "me", params],
        refetchInterval: REFRESH_MS,
    })

export const useGetAdminNotifications = (params: ListParams = {}) =>
    useInfiniteQuery<Notification>(ENDPOINTS.ADMIN_NOTIFICATIONS, params, {
        queryKey: ["admin", "notifications", params],
        refetchInterval: REFRESH_MS,
    })
