import type { OrderStatus, OrderWithUser, Order } from "./order"
import type { Reservation } from "./reservation"
import type { Ticket } from "./ticket"

export interface DashboardStats {
    orderCount: number
    revenue: number
    latestOrders: OrderWithUser[]
    recentReservations: Reservation[]
    latestTickets: Ticket[]
    messageCount: number
    salesByDay: DailySales[]
    ordersByStatus: StatusCount[]
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

export interface UserDashboard {
    latestOrders: Order[]
    latestTickets: Ticket[]
}
