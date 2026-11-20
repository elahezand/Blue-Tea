import type { ID } from "./api"
import type { OrderStatus } from "./order"

export type { OrderStatus }

export interface Revenue {
    total: number
    orders: number
    average: number
}

export interface DailySales {
    date: string
    total: number
    orders: number
}

export interface StatusCount {
    status: OrderStatus
    count: number
}

export interface DashboardProduct {
    _id: ID
    name: string
    img?: string
    price?: number
    sold?: number
    stock?: number
}

export interface DashboardStats {
    sales: {
        today: Revenue
        last30Days: Revenue
        allTime: Revenue
        chart: DailySales[]
        topProducts: DashboardProduct[]
    }
    waiting: {
        ordersToProcess: number
        pendingReservations: number
        openTickets: number
        pendingComments: number
        unansweredContacts: number
    }
    overview: {
        ordersByStatus: Record<OrderStatus, number>
        reservationsToday: number
        lowStock: DashboardProduct[]
        users: { total: number; new30Days: number }
    }
}

export interface UserDashboard {
    orders: { total: number; active: number }
    tickets: { total: number; open: number }
    nextReservation: { _id: ID; date: string; time: string; guests: number } | null
}