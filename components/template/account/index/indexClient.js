"use client"
import React from 'react'
import Link from 'next/link'
import { MdOutlineShoppingBag, MdOutlineEventAvailable, MdOutlineForum, MdFavoriteBorder } from 'react-icons/md'

/* Quick links into the account area. */
const LINKS = [
    { icon: MdOutlineShoppingBag, title: "Orders", text: "Track what you ordered", href: "/account/orders" },
    { icon: MdOutlineEventAvailable, title: "Reservations", text: "Your upcoming tables", href: "/account/reservations" },
    { icon: MdOutlineForum, title: "Comments", text: "Reviews you have written", href: "/account/comments" },
    { icon: MdFavoriteBorder, title: "Favorites", text: "Products you saved", href: "/favorites" },
]

export default function IndexClient() {
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
        </div>
    )
}
