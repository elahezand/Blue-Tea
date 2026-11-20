import type { Types } from "mongoose"
import Comment from "../models/Comment.js"
import Contact from "../models/Contact.js"
import Order, { ORDER_STATUSES, type OrderStatus } from "../models/Order.js"
import Product from "../models/Product.js"
import Reservation from "../models/Reservation.js"
import Ticket from "../models/Ticket.js"
import User from "../models/User.js"

const PAID: OrderStatus[] = ["paid", "processing", "shipped", "delivered"]
const ACTIVE: OrderStatus[] = ["pending", "paid", "processing", "shipped"]
const LOW_STOCK = 5
const CHART_DAYS = 30
const DAY_MS = 24 * 60 * 60 * 1000
const TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone

const dayKey = (date: Date) => date.toLocaleDateString("en-CA", { timeZone: TIMEZONE })

const daysAgo = (days: number) => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return new Date(date.getTime() - days * DAY_MS)
}

const round = (value: number) => Math.round(value * 100) / 100

/* ---------- User ---------- */

export const getUserDashboard = async (userId: Types.ObjectId) => {
    const [orders, activeOrders, tickets, openTickets, nextReservation] = await Promise.all([
        Order.countDocuments({ user: userId }),
        Order.countDocuments({ user: userId, status: { $in: ACTIVE } }),
        Ticket.countDocuments({ user: userId, parent: null }),
        Ticket.countDocuments({ user: userId, parent: null, status: "open" }),
        Reservation.findOne({ user: userId, status: "confirmed", date: { $gte: dayKey(new Date()) } })
            .sort({ date: 1, time: 1 })
            .select("date time guests")
            .lean(),
    ])

    return {
        orders: { total: orders, active: activeOrders },
        tickets: { total: tickets, open: openTickets },
        nextReservation,
    }
}

/* ---------- Admin ---------- */

const revenue = async (from?: Date) => {
    const [row] = await Order.aggregate<{ total: number; count: number }>([
        { $match: { status: { $in: PAID }, ...(from ? { createdAt: { $gte: from } } : {}) } },
        { $group: { _id: null, total: { $sum: "$pricing.total" }, count: { $sum: 1 } } },
    ])
    const total = round(row?.total ?? 0)
    const count = row?.count ?? 0
    return { total, orders: count, average: count ? round(total / count) : 0 }
}

const salesChart = async () => {
    const from = daysAgo(CHART_DAYS - 1)
    const rows = await Order.aggregate<{ _id: string; total: number; orders: number }>([
        { $match: { status: { $in: PAID }, createdAt: { $gte: from } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: TIMEZONE } },
                total: { $sum: "$pricing.total" },
                orders: { $sum: 1 },
            },
        },
    ])
    const byDay = new Map(rows.map((row) => [row._id, row]))

    return Array.from({ length: CHART_DAYS }, (_, i) => {
        const date = dayKey(new Date(from.getTime() + i * DAY_MS))
        const row = byDay.get(date)
        return { date, total: round(row?.total ?? 0), orders: row?.orders ?? 0 }
    })
}

const ordersByStatus = async () => {
    const rows = await Order.aggregate<{ _id: OrderStatus; count: number }>([
        { $group: { _id: "$status", count: { $sum: 1 } } },
    ])
    const counts = Object.fromEntries(ORDER_STATUSES.map((status) => [status, 0])) as Record<OrderStatus, number>
    for (const row of rows) counts[row._id] = row.count
    return counts
}

export const getAdminDashboard = async () => {
    const [
        today,
        last30Days,
        allTime,
        chart,
        topProducts,
        ordersToProcess,
        pendingReservations,
        openTickets,
        pendingComments,
        unansweredContacts,
        statuses,
        reservationsToday,
        lowStock,
        users,
        newUsers,
    ] = await Promise.all([
        revenue(daysAgo(0)),
        revenue(daysAgo(CHART_DAYS - 1)),
        revenue(),
        salesChart(),
        Product.find({ sold: { $gt: 0 } }).sort({ sold: -1 }).limit(5).select("name img price sold").lean(),
        Order.countDocuments({ status: "paid" }),
        Reservation.countDocuments({ status: "pending" }),
        Ticket.countDocuments({ parent: null, status: "open" }),
        Comment.countDocuments({ parent: null, status: "pending" }),
        Contact.countDocuments({ answeredAt: null }),
        ordersByStatus(),
        Reservation.countDocuments({ date: dayKey(new Date()), status: { $in: ["pending", "confirmed"] } }),
        Product.find({ isAvailable: true, stock: { $lte: LOW_STOCK } }).sort({ stock: 1 }).limit(10).select("name img stock").lean(),
        User.countDocuments({ role: "USER" }),
        User.countDocuments({ role: "USER", createdAt: { $gte: daysAgo(CHART_DAYS - 1) } }),
    ])

    return {
        sales: { today, last30Days, allTime, chart, topProducts },
        waiting: { ordersToProcess, pendingReservations, openTickets, pendingComments, unansweredContacts },
        overview: { ordersByStatus: statuses, reservationsToday, lowStock, users: { total: users, new30Days: newUsers } },
    }
}