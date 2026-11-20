"use client"
import Link from "next/link"
import { MdOutlinePaid, MdOutlineReceiptLong, MdOutlineEventAvailable, MdOutlinePeopleAlt, MdOutlineAdd } from "react-icons/md"
import Loader from "@/components/feedback/loader"
import SalesChart from "./salesChart"
import StatusBreakdown from "./statusBreakdown"
import { useProfile } from "@/services/user.service"
import { useGetAdminDashboard } from "@/services/dashboard.service"
import { formatPrice } from "@/utils/helper"
import type { OrderStatus, StatusCount } from "@/types/dashboard"

const ACTIONS = [
    { label: "Add a product", href: "/p-admin/products/create" },
    { label: "Add a menu item", href: "/p-admin/menu/create" },
    { label: "Write an article", href: "/p-admin/articles/create" },
]

const more = "text-sm font-medium text-link hover:underline"

export default function Dashboard() {
    const { data: me } = useProfile()
    const { data, isLoading, isError } = useGetAdminDashboard()

    if (isLoading) return <Loader inline label="Loading the dashboard" />
    if (isError || !data) return <p className="rounded-2xl bg-soft/70 px-5 py-10 text-center text-berry">Couldn&apos;t load the dashboard. Please try again.</p>

    const { sales, waiting, overview } = data
    const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })

   const statusList: StatusCount[] = (Object.keys(overview.ordersByStatus) as OrderStatus[])
    .map((status) => ({ status, count: overview.ordersByStatus[status] }))

    const stats = [
        { icon: MdOutlinePaid, title: "Revenue, 30 days", value: formatPrice(sales.last30Days.total), sub: `${formatPrice(sales.today.total)} today`, href: "/p-admin/orders" },
        { icon: MdOutlineReceiptLong, title: "Orders, 30 days", value: sales.last30Days.orders.toLocaleString(), sub: `${formatPrice(sales.last30Days.average)} average`, href: "/p-admin/orders" },
        { icon: MdOutlineEventAvailable, title: "Tables today", value: overview.reservationsToday.toLocaleString(), sub: `${waiting.pendingReservations} waiting to confirm`, href: "/p-admin/reservations" },
        { icon: MdOutlinePeopleAlt, title: "Customers", value: overview.users.total.toLocaleString(), sub: `${overview.users.new30Days} new in 30 days`, href: "/p-admin/users" },
    ]

    const todo = [
        { label: "Orders to prepare", count: waiting.ordersToProcess, href: "/p-admin/orders?status=paid" },
        { label: "Reservations to confirm", count: waiting.pendingReservations, href: "/p-admin/reservations?status=pending" },
        { label: "Open tickets", count: waiting.openTickets, href: "/p-admin/tickets?status=open" },
        { label: "Reviews to approve", count: waiting.pendingComments, href: "/p-admin/comments?status=pending" },
        { label: "Messages to answer", count: waiting.unansweredContacts, href: "/p-admin/contacts?answered=false" },
    ]
    const todoTotal = todo.reduce((sum, t) => sum + t.count, 0)

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
                        <span className="min-w-0">
                            <span className="block text-sm text-muted">{item.title}</span>
                            <span className="block font-display text-2xl font-semibold text-fg">{item.value}</span>
                            <span className="block truncate text-xs text-muted">{item.sub}</span>
                        </span>
                    </Link>
                ))}
            </div>

            <div className="mb-8 grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-3">
                <div className="admin-card p-5 xl:col-span-2">
                    <h2 className="mb-4 text-lg font-semibold text-[var(--head)]">Sales, last 30 days</h2>
                    <SalesChart data={sales.chart} />
                </div>
                <div className="admin-card p-5">
                    <div className="mb-4 flex items-baseline justify-between">
                        <h2 className="m-0 text-lg font-semibold text-[var(--head)]">Waiting for you</h2>
                        {todoTotal > 0 && <span className="rounded-full bg-[var(--lamp)] px-2.5 py-0.5 text-xs font-semibold text-[var(--navy)]">{todoTotal}</span>}
                    </div>
                    <ul className="m-0 list-none divide-y divide-[var(--line)] p-0">
                        {todo.map((t) => (
                            <li key={t.label}>
                                <Link href={t.href} className="flex items-center justify-between gap-3 py-2.5 text-sm text-fg hover:text-link">
                                    <span className="flex items-center gap-2">
                                        {t.count > 0 && <span aria-hidden className="size-2 rounded-full bg-[var(--lamp)]" />}
                                        {t.label}
                                    </span>
                                    <span className={`font-display text-lg ${t.count ? "text-fg" : "text-muted"}`}>{t.count}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="mb-8 grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-3">
                <div className="admin-card p-5">
                    <h2 className="mb-4 text-lg font-semibold text-[var(--head)]">Orders by status</h2>
                    <StatusBreakdown data={statusList} />
                </div>
                <div className="admin-card p-5">
                    <div className="mb-4 flex items-baseline justify-between">
                        <h2 className="m-0 text-lg font-semibold text-[var(--head)]">Best sellers</h2>
                        <Link href="/p-admin/products" className={more}>All products</Link>
                    </div>
                    {sales.topProducts.length ? (
                        <ol className="m-0 list-none space-y-3 p-0">
                            {sales.topProducts.map((p, i) => (
                                <li key={p._id} className="flex items-center gap-3 text-sm">
                                    <span className="w-5 font-display text-lg text-muted">{i + 1}</span>
                                    <Link href={`/p-admin/products/${p._id}`} className="min-w-0 flex-1 truncate text-fg hover:text-link">{p.name}</Link>
                                    <span className="text-muted">{p.sold} sold</span>
                                </li>
                            ))}
                        </ol>
                    ) : <p className="m-0 text-sm text-muted">No sales yet.</p>}
                </div>
                <div className="admin-card p-5">
                    <div className="mb-4 flex items-baseline justify-between">
                        <h2 className="m-0 text-lg font-semibold text-[var(--head)]">Running low</h2>
                        <Link href="/p-admin/products" className={more}>Restock</Link>
                    </div>
                    {overview.lowStock.length ? (
                        <ul className="m-0 list-none space-y-3 p-0">
                            {overview.lowStock.map((p) => (
                                <li key={p._id} className="flex items-center justify-between gap-3 text-sm">
                                    <Link href={`/p-admin/products/${p._id}`} className="min-w-0 truncate text-fg hover:text-link">{p.name}</Link>
                                    <span className={p.stock === 0 ? "font-medium text-berry" : "text-muted"}>{p.stock === 0 ? "Out" : `${p.stock} left`}</span>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="m-0 text-sm text-muted">Everything is well stocked.</p>}
                </div>
            </div>

            <div className="admin-card p-5">
                <h2 className="mb-4 text-lg font-semibold text-[var(--head)]">Quick actions</h2>
                <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-3">
                    {ACTIONS.map((a) => (
                        <li key={a.href}>
                            <Link href={a.href} className="flex items-center justify-between rounded-full border border-solid border-line px-5 py-2.5 text-sm font-medium text-fg transition-colors hover:border-brown hover:bg-soft hover:text-link">
                                {a.label}<MdOutlineAdd aria-hidden className="text-lg" />
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}