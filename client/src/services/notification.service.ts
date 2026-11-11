import { useQueryClient } from "@tanstack/react-query"
import { useInfiniteQuery, usePost } from "@/hooks/useApi"
import { ENDPOINTS } from "@/utils/constant"
import type { ListParams } from "@/types/api"
import type { MarkReadBody, Notification, NotificationScope } from "@/types/notification"

const NOTIFICATIONS_KEY = ["notifications"]
const REFRESH_MS = 60 * 1000

export const useGetNotifications = (scope: NotificationScope, params: ListParams = {}) =>
    useInfiniteQuery<Notification>(scope === "admin" ? ENDPOINTS.ADMIN_NOTIFICATIONS : ENDPOINTS.MY_NOTIFICATIONS, params, {
        queryKey: [...NOTIFICATIONS_KEY, scope, params],
        refetchInterval: REFRESH_MS,
    })

export const useMarkNotificationsRead = () => {
    const queryClient = useQueryClient()

    return usePost<unknown, MarkReadBody>(ENDPOINTS.NOTIFICATIONS_READ, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY })
        },
        silent: true,
    })
}
