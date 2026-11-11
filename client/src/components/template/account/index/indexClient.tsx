"use client"
import Link from "next/link"
import { MdOutlineShoppingBag, MdOutlineEventAvailable, MdOutlineForum, MdFavoriteBorder } from "react-icons/md"
import Badge from "@/components/modules/badge"
import timeAgo from "@/components/modules/p-admin/timeAgo"
import { useGetMyDashboard } from "@/services/dashboard.service"
import { formatPrice } from "@/utils/helper"

const LINKS = [
    { icon: MdOutlineShoppingBag, title: "Orders", text: "Track what you ordered", href: "/account/orders" },
    { icon: MdOutlineEventAvailable, title: "Reservations", text: "Your upcoming tables", href: "/account/reservations" },
    { icon: MdOutlineForum, title: "Comments", text: "Reviews you have written", href: "/account/comments" },
    { icon: MdFavoriteBorder, title: "Favorites", text: "Products you saved", href: "/favorites" },
]

export default function IndexClient() {
    const { data } = useGetMyDashboard()
    const orders = data?.latestOrders ?? []
    const tickets = data?.latestTickets ?? []

    return (
        <div>
            <p className="script m-0 text-2xl text-[var(--green)]">Welcome back</p>
            <h2 className="mb-6 mt-1 text-2xl" style={{ color: "var(--head)" }}>What would you like to do?</h2>
            <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2">
                {LINKS.map(({ icon: Icon, title, text, href }) => (
                    <li key={href}>
                        <Link href={href} className="group flex h-full items-center gap-4 rounded-2xl border border-solid border-line bg-surface p-5 transition-colors hover:border-[var(--accent)]">
                            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-soft text-2xl text-link"><Icon /></span>
                            <span className="min-w-0 flex-1">
                                <span className="block font-display text-lg text-fg">{title}</span>
                                <span className="block text-sm text-muted">{text}</span>
                            </span>
                            <span aria-hidden className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-link">→</span>
                        </Link>
                    </li>
                ))}
            </ul>

            {(orders.length > 0 || tickets.length > 0) && (
                <div className="mt-10 grid gap-6 lg:grid-cols-2">
                    {orders.length > 0 && (
                        <section>
                            <h3 className="mb-3 text-lg text-[var(--head)]">Latest orders</h3>
                            <ul className="m-0 list-none divide-y divide-[var(--line)] rounded-2xl border border-solid border-line bg-surface p-0">
                                {orders.map((o) => (
                                    <li key={o._id}>
                                        <Link href={`/account/orders/${o._id}`} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-soft">
                                            <span className="text-sm text-fg">#{String(o._id).slice(-6).toUpperCase()} <span className="text-muted">· {formatPrice(o.totalPrice)}</span></span>
                                            <Badge value={o.status} />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                    {tickets.length > 0 && (
                        <section>
                            <h3 className="mb-3 text-lg text-[var(--head)]">Latest tickets</h3>
                            <ul className="m-0 list-none divide-y divide-[var(--line)] rounded-2xl border border-solid border-line bg-surface p-0">
                                {tickets.map((t) => (
                                    <li key={t._id}>
                                        <Link href={`/account/tickets/${t._id}`} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-soft">
                                            <span className="min-w-0 truncate text-sm text-fg">{t.subject} <span className="text-muted">· {timeAgo(t.updatedAt)}</span></span>
                                            <Badge value={t.status} />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            )}
        </div>
    )
}
