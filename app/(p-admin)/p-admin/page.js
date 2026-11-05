import React from 'react'
import connectToDB from '@/configs/db';
import PieChart from '@/components/modules/chart/chart';
import ParetoChart from '@/components/modules/chart/chart1';
import { getMe } from '@/utils/auth';
import Table from '@/components/modules/table/Table';
import Link from "next/link"
import ProductModel from "@/model/product"
import OrderModel from "@/model/order"
import ReservationModel from "@/model/reservation"
import ContactModel from "@/model/contact"
import Badge from "@/components/modules/badge"
import { MdOutlinePaid, MdOutlineReceiptLong, MdOutlineEventAvailable, MdOutlineMarkEmailUnread, MdOutlineAdd } from "react-icons/md"
const safe = async (fn, fallback) => { try { return await fn() } catch { return fallback } }
const money = (n) => `$${(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default async function page() {
    await connectToDB()
    const [me, orderCount, revenueRows, latestOrders, recentReservations, messageCount] = await Promise.all([
        getMe(),
        safe(() => OrderModel.countDocuments(), 0),
        safe(() => OrderModel.aggregate([{ $group: { _id: null, total: { $sum: "$totalPrice" } } }]), []),
        safe(() => OrderModel.find().sort({ _id: -1 }).limit(5).populate("user", "name").lean(), []),
        safe(() => ReservationModel.find().sort({ _id: -1 }).limit(40).lean(), []),
        safe(() => ContactModel.countDocuments(), 0),
    ])

    // Upcoming = today or later, soonest first (works whether the date is stored as text or as a Date)
    const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0)
    const upcoming = JSON.parse(JSON.stringify(recentReservations))
        .filter((r) => r.date && new Date(r.date) >= startOfToday)
        .sort((x, y) => new Date(x.date) - new Date(y.date) || String(x.time).localeCompare(String(y.time)))
    const orders = JSON.parse(JSON.stringify(latestOrders))
    const revenue = revenueRows?.[0]?.total || 0
    const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })

    const stats = [
        { icon: MdOutlinePaid, title: "Revenue", value: money(revenue), href: "/p-admin/orders" },
        { icon: MdOutlineReceiptLong, title: "Orders", value: orderCount.toLocaleString(), href: "/p-admin/orders" },
        { icon: MdOutlineEventAvailable, title: "Upcoming tables", value: upcoming.length.toLocaleString(), href: "/p-admin/reservations" },
        { icon: MdOutlineMarkEmailUnread, title: "Messages", value: messageCount.toLocaleString(), href: "/p-admin/contacts" },
    ]
    const actions = [
        { label: "Add a product", href: "/p-admin/products/create" },
        { label: "Add a menu item", href: "/p-admin/menu/create" },
        { label: "Write an article", href: "/p-admin/articles/create" },
    ]
    const more = "text-sm font-medium text-link hover:underline"

    return (
        <div className="w-full pb-10">
            <div className="mb-8">
                <h2 className="mb-1 text-xl font-semibold text-[var(--head)] md:text-2xl">Hello, {me?.name}</h2>
                <p className="m-0 text-sm text-muted">{today}. Here is what needs you at Blue Tea.</p>
            </div>

            <div className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
                {stats.map((item) => (
                    <Link key={item.title} href={item.href} className="admin-card group flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                        <span className="admin-icon"><item.icon /></span>
                        <span>
                            <span className="block text-sm text-muted">{item.title}</span>
                            <span className="block font-display text-2xl font-semibold text-fg">{item.value}</span>
                        </span>
                    </Link>
                ))}
            </div>

            <div className="mb-8 grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-2">
                <div className="min-w-0">
                    <div className="mb-3 flex items-baseline justify-between">
                        <h2 className="m-0 text-lg font-semibold text-[var(--head)]">Upcoming tables</h2>
                        <Link href="/p-admin/reservations" className={more}>All reservations</Link>
                    </div>
                    <Table>
                        <thead><tr><th>When</th><th>Name</th><th>Guests</th><th>Status</th></tr></thead>
                        <tbody>
                            {upcoming.slice(0, 6).map((r, i) => (
                                <tr key={r._id || i}>
                                    <td className="whitespace-nowrap">{String(r.date).slice(0, 10)} <span className="text-muted">{r.time}</span></td>
                                    <td>{r.name}</td>
                                    <td>{r.guests}</td>
                                    <td><Badge value={r.status} /></td>
                                </tr>
                            ))}
                            {upcoming.length === 0 && <tr><td colSpan="4" className="!py-6 text-center text-muted">No upcoming reservations.</td></tr>}
                        </tbody>
                    </Table>
                </div>
                <div className="min-w-0">
                    <div className="mb-3 flex items-baseline justify-between">
                        <h2 className="m-0 text-lg font-semibold text-[var(--head)]">Latest orders</h2>
                        <Link href="/p-admin/orders" className={more}>All orders</Link>
                    </div>
                    <Table>
                        <thead><tr><th>Customer</th><th>Total</th><th>Status</th><th>Payment</th></tr></thead>
                        <tbody>
                            {orders.map((o, i) => (
                                <tr key={o._id || i}>
                                    <td>{o.user?.name || "-"}</td>
                                    <td className="whitespace-nowrap">{money(o.totalPrice)}</td>
                                    <td><Badge value={o.status} /></td>
                                    <td><Badge value={o.isPaid ? "Paid" : "Unpaid"} /></td>
                                </tr>
                            ))}
                            {orders.length === 0 && <tr><td colSpan="4" className="!py-6 text-center text-muted">No orders yet.</td></tr>}
                        </tbody>
                    </Table>
                </div>
            </div>

            <div className="mb-8 admin-card p-5">
                <h2 className="mb-4 text-lg font-semibold text-[var(--head)]">Quick actions</h2>
                <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-3">
                    {actions.map((a) => (
                        <li key={a.href}>
                            <Link href={a.href} className="flex items-center justify-between rounded-full border border-solid border-line px-5 py-2.5 text-sm font-medium text-fg transition-colors hover:border-brown hover:bg-soft hover:text-link">
                                {a.label}<MdOutlineAdd aria-hidden className="text-lg" />
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-3">
                <div className="admin-card p-5 xl:col-span-2">
                    <h2 className="mb-4 text-lg font-semibold text-[var(--head)]">Analytics overview</h2>
                    <ParetoChart />
                </div>
                <div className="admin-card p-5">
                    <h2 className="mb-4 text-lg font-semibold text-[var(--head)]">User activity</h2>
                    <PieChart />
                </div>
            </div>
        </div>
    )
}
