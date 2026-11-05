"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MdClose, MdFavoriteBorder, MdMenu, MdOutlineShoppingCart } from "react-icons/md"
import { useContext } from "react"
import CartContext from "@/utils/context/cartProvider"
import ThemeToggle from "@/components/modules/themeToggle"

const base = "block rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10 max-lg:py-3 max-lg:text-base"
const mbase = "block rounded-full px-4 py-3 text-base font-medium transition-colors hover:bg-soft hover:text-link"

function Badge({ n }) {
    if (!n) return null
    return (
        <span className="absolute -top-1.5 -right-2 min-w-4.5 rounded-full bg-[var(--lamp)] px-1 text-center text-[11px] leading-[18px] font-semibold text-[var(--navy)]">
            {n}
        </span>
    )
}

export default function NavMenu({ categories = [], user, favoritesCount = 0 }) {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()
    const { cart } = useContext(CartContext)

    useEffect(() => { setOpen(false) }, [pathname])
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : ""
        return () => { document.body.style.overflow = "" }
    }, [open])

    const active = (href) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href)
    const cls = (href) => `${base} ${active(href) ? "bg-white/15 text-white" : "text-[var(--cream)]"}`
    const mcls = (href) => `${mbase} ${active(href) ? "bg-soft text-link" : "text-fg"}`

    const links = [
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
                    <Badge n={cart?.length} />
                </Link>
                <ThemeToggle />
                {user ? (
                    <Link href="/account" className="hidden max-w-32 truncate rounded-full border border-solid border-white/30 px-4 py-2 text-sm font-medium text-[var(--cream)] transition hover:bg-white/10 sm:inline-block">{user.name}</Link>
                ) : (
                    <Link href="/login-register" className="hidden rounded-full border border-solid border-white/30 px-4 py-2 text-sm font-medium text-[var(--cream)] transition hover:bg-white/10 sm:inline-block">Sign in</Link>
                )}
                <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="mobile-nav"
                    aria-label={open ? "Close menu" : "Open menu"}
                    className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-solid border-white/30 bg-transparent text-[var(--cream)] lg:hidden">
                    {open ? <MdClose size={20} /> : <MdMenu size={20} />}
                </button>
            </div>

            {open && (
                <div id="mobile-nav" className="fixed inset-0 z-40 overflow-y-auto bg-canvas px-4 pb-4 pt-[84px] lg:hidden">
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
