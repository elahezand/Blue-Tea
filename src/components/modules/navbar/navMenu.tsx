"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MdClose, MdFavoriteBorder, MdMenu, MdOutlineShoppingCart } from "react-icons/md"
import type { ProductCategoryNode } from "@/types/models"
import ThemeToggle from "@/components/modules/themeToggle"

const base = "block rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10 max-lg:py-3 max-lg:text-base"
const mbase = "block rounded-full px-4 py-3 text-base font-medium transition-colors hover:bg-soft hover:text-link"

function Badge({ n }: { n?: number }) {
    if (!n) return null
    return (
        <span className="absolute -top-1.5 -right-2 min-w-4.5 rounded-full bg-[var(--lamp)] px-1 text-center text-[11px] leading-[18px] font-semibold text-[var(--navy)]">
            {n}
        </span>
    )
}

interface NavMenuProps {
    categories?: Pick<ProductCategoryNode, "_id" | "name">[]
    user: { name: string } | null
    favoritesCount?: number
}

export default function NavMenu({ categories = [], user, favoritesCount = 0 }: NavMenuProps) {
    const [open, setOpen] = useState(false)
    const [top, setTop] = useState(70)
    const pathname = usePathname()
    // TODO: number of items in the cart (comes from the backend, request removed for now)
    const cartCount = 0

    useEffect(() => { setOpen(false) }, [pathname])
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : ""
        if (open) setTop(document.querySelector<HTMLElement>("header.awning")?.offsetHeight || 70)
        return () => { document.body.style.overflow = "" }
    }, [open])

    const active = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href)
    const cls = (href: string) => `${base} ${active(href) ? "bg-white/15 text-white" : "text-[var(--cream)]"}`
    const mcls = (href: string) => `${mbase} ${active(href) ? "bg-soft text-link" : "text-fg"}`

    const links: { href: string; label: string; plain?: boolean }[] = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/#menu", label: "Menu", plain: true },
        { href: "/products", label: "Store" },
        { href: "/articles", label: "Journal" },
        { href: "/contact-us", label: "Contact" },
    ]

    return (
        <>
            <div className="hidden items-center gap-1 lg:flex">
                {links.map((l) =>
                    l.label === "Store" ? (
                        <div className="group relative" key={l.href}>
                            <Link href={l.href} className={cls(l.href)}>{l.label}</Link>
                            {categories.length > 0 && (
                                <div className="invisible absolute top-full left-0 z-50 min-w-44 rounded-xl border border-line bg-surface p-2 opacity-0 shadow-lg transition duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                                    {categories.map((cat) => (
                                        <Link key={cat._id || cat.name} href={`/products?category=${cat.name}`}
                                            className="block rounded-xl px-3 py-2 text-sm text-fg hover:bg-soft hover:text-link">
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link key={l.href} href={l.href} className={l.plain ? `${base} text-[var(--cream)]` : cls(l.href)}>{l.label}</Link>
                    )
                )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                <Link href="/#reservation" className="hidden rounded-full bg-[var(--cream)] px-4 py-2 text-sm font-medium !text-[var(--navy)] transition hover:brightness-95 lg:inline-flex">
                    <span className="xl:hidden">Book</span><span className="hidden xl:inline">Book a table</span>
                </Link>
                <Link href="/favorites" aria-label="Favorites" className="relative p-2 text-[var(--cream)] hover:text-white">
                    <MdFavoriteBorder size={22} />
                    <Badge n={favoritesCount} />
                </Link>
                <Link href="/cart" aria-label="Cart" className="relative p-2 text-[var(--cream)] hover:text-white">
                    <MdOutlineShoppingCart size={22} />
                    <Badge n={cartCount} />
                </Link>
                <ThemeToggle />
                {user ? (
                    <Link href="/account" className="hidden max-w-32 truncate rounded-full border border-solid border-white/30 px-4 py-2 text-sm font-medium text-[var(--cream)] transition hover:bg-white/10 sm:inline-block">{user.name}</Link>
                ) : (
                    <Link href="/login-register" className="hidden rounded-full border border-solid border-white/30 px-4 py-2 text-sm font-medium text-[var(--cream)] transition hover:bg-white/10 sm:inline-block">Sign in</Link>
                )}
                <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="mobile-nav"
                    aria-label={open ? "Close menu" : "Open menu"}
                    className={`relative z-50 flex size-10 cursor-pointer items-center justify-center rounded-full border border-solid border-white/30 text-[var(--cream)] transition-colors lg:hidden ${open ? "bg-white/15" : "bg-transparent"}`}>
                    {open ? <MdClose size={20} /> : <MdMenu size={20} />}
                </button>
            </div>

            {open && (
                <div id="mobile-nav" style={{ top }} className="fixed inset-x-0 bottom-0 z-40 overflow-y-auto bg-canvas px-4 pt-6 pb-6 lg:hidden">
                    <nav className="container flex flex-col">
                        <Link href="/#reservation" className="btn-organic mb-4 bg-brown px-5 py-3 text-center font-medium !text-white">Book a table</Link>
                        {links.map((l) => (
                            <Link key={l.href} href={l.href} className={`${mcls(l.href)} border-b border-line`}>{l.label}</Link>
                        ))}
                        {categories.length > 0 && (
                            <div className="flex flex-wrap gap-2 border-b border-line py-4">
                                {categories.map((cat) => (
                                    <Link key={cat._id || cat.name} href={`/products?category=${cat.name}`}
                                        className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-fg">{cat.name}</Link>
                                ))}
                            </div>
                        )}
                        {user ? (
                            <Link href="/account" className="btn-organic mt-3 bg-surface px-5 py-3 text-center font-medium text-fg">{user.name}</Link>
                        ) : (
                            <Link href="/login-register" className="btn-organic mt-3 bg-surface px-5 py-3 text-center font-medium text-fg">Sign in or create account</Link>
                        )}
                    </nav>
                </div>
            )}
        </>
    )
}