import { useGet } from "@/hooks/useApi"
import { ENDPOINTS } from "@/utils/constant"
import type { ApiResponse } from "@/types/api"
import type { DashboardStats, UserDashboard } from "@/types/dashboard"

export const useGetAdminDashboard = () =>
    useGet<ApiResponse<DashboardStats>, DashboardStats>(ENDPOINTS.ADMIN_DASHBOARD, {}, {
        queryKey: ["admin", "dashboard"],
        select: (res) => res.data,
    })

export const useGetMyDashboard = () =>
    useGet<ApiResponse<UserDashboard>, UserDashboard>(ENDPOINTS.MY_DASHBOARD, {}, {
        queryKey: ["dashboard", "me"],
        select: (res) => res.data,
    })
