import type { DashboardStats } from "@/types/models"
// TODO: write these.

export const getDashboardStats = async (): Promise<DashboardStats> => {
    return { orderCount: 0, revenue: 0, latestOrders: [], recentReservations: [], messageCount: 0 }
}
