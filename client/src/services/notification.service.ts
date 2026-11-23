import { useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useDelete, useGet, useInfiniteQuery, usePost } from "@/hooks/useApi"
import { ENDPOINTS } from "@/utils/constant"
import type { ApiResponse, ListParams } from "@/types/api"
import type { CreateNotificationBody, MarkReadBody, Notification, NotificationRecipient, NotificationScope } from "@/types/notification"

const NOTIFICATIONS_KEY = ["notifications"]
const REFRESH_MS = 60 * 1000

export const useGetNotifications = (scope: NotificationScope, params: ListParams = {}) =>
    useInfiniteQuery<Notification>(ENDPOINTS.ADMIN_NOTIFICATIONS, params, {
        queryKey: [...NOTIFICATIONS_KEY, scope, params],
        refetchInterval: REFRESH_MS,
    })

export const useMarkNotificationRead = () => {
    const queryClient = useQueryClient()

    return usePost<unknown, MarkReadBody>(ENDPOINTS.NOTIFICATIONS_READ, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY })
        },
        silent: true,
    })
}

export const useNotificationRecipients = () =>
    useGet<ApiResponse<NotificationRecipient[]>, NotificationRecipient[]>(ENDPOINTS.NOTIFICATION_RECIPIENTS, {}, {
        select: ({ data }) => data,
        silent: true,
    })

export const useCreateNotification = () => {
    const queryClient = useQueryClient()

    return usePost<unknown, CreateNotificationBody>(ENDPOINTS.NOTIFICATIONS, {
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY })
            toast.success("Notification sent")
        },
        errorFallback: "Couldn’t send the notification",
        silent: true,
    })
}

export const useDeleteNotification = () => {
    const queryClient = useQueryClient()

    return useDelete(ENDPOINTS.NOTIFICATIONS, {
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY })
            toast.success("Notification removed")
        },
        errorFallback: "Couldn’t remove the notification",
    })
}
