"use client"
import Link from "next/link"
import { MdOutlineShoppingBag, MdOutlineEventAvailable, MdOutlineForum, MdFavoriteBorder, MdOutlineSupportAgent } from "react-icons/md"
import { useGetMyDashboard } from "@/services/dashboard.service"

const LINKS = [
    { icon: MdOutlineShoppingBag, title: "Orders", text: "Track what you ordered", href: "/account/orders" },
    { icon: MdOutlineEventAvailable, title: "Reservations", text: "Your upcoming tables", href: "/account/reservations" },
    { icon: MdOutlineSupportAgent, title: "Tickets", text: "Ask us for help", href: "/account/tickets" },
    { icon: MdOutlineForum, title: "Comments", text: "Reviews you have written", href: "/account/comments" },
    { icon: MdFavoriteBorder, title: "Favorites", text: "Products you saved", href: "/favorites" },
]

const tableDay = (date: string) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })

function Stat({ label, value, sub, href }: { label: string; value?: number; sub: string; href: string }) {
    return (
        <Link href={href} className="flex flex-col gap-1 rounded-2xl border border-solid border-line bg-surface p-5 transition-colors hover:border-[var(--accent)]">
            <span className="text-sm text-muted">{label}</span>
            <span className="font-display text-3xl leading-none text-fg">{value ?? "–"}</span>
            <span className="text-xs text-muted">{sub}</span>
        </Link>
    )
}

export default function IndexClient() {
    const { data } = useGetMyDashboard()
    const next = data?.nextReservation

    return (
        <div>
            <p className="script m-0 text-2xl text-[var(--script)]">Welcome back</p>
            <h2 className="mb-6 mt-1 text-2xl" style={{ color: "var(--head)" }}>What would you like to do?</h2>

            <div className="mb-8 grid gap-4 sm:grid-cols-3">
                <Stat label="Orders" value={data?.orders.total} sub={`${data?.orders.active ?? 0} on the way`} href="/account/orders" />
                <Stat label="Tickets" value={data?.tickets.total} sub={`${data?.tickets.open ?? 0} open`} href="/account/tickets" />
                <Link href={next ? "/account/reservations" : "/#reservation"} className="board flex flex-col gap-1 !rounded-2xl p-5">
                    <span className="text-sm text-[var(--cream)]/70">Next table</span>
                    {next ? (
                        <>
                            <span className="font-display text-xl leading-tight text-[var(--cream)]">{tableDay(next.date)}</span>
                            <span className="text-xs text-[var(--lamp)]">at {next.time} · {next.guests} {next.guests === 1 ? "guest" : "guests"}</span>
                        </>
                    ) : (
                        <>
                            <span className="font-display text-xl leading-tight text-[var(--cream)]">No table booked</span>
                            <span className="text-xs text-[var(--lamp)]">Book one for your next visit</span>
                        </>
                    )}
                </Link>
            </div>

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
        </div>
    )
}