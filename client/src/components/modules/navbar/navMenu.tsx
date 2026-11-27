"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MdClose, MdFavoriteBorder, MdMenu } from "react-icons/md"
import type { ProductCategoryNode } from "@/types/category"
import ThemeToggle from "@/components/modules/themeToggle"
import ChristmasToggle from "./christmasToggle"
import { useProfile } from "@/services/user.service"
import { useAuth } from "@/hooks/useAuth"
import CartPreview from "./cartPreview"
import { useSavedProductIds } from "@/services/wishlist.service"

const base = "block rounded-full px-2 py-2 text-sm font-medium transition-colors hover:bg-white/10 2xl:px-4"
const mbase = "block rounded-full px-4 py-3 text-base font-medium transition-colors hover:bg-soft hover:text-link"

interface NavMenuProps {
    categories?: Pick<ProductCategoryNode, "_id" | "name" | "slug">[]
}

export default function NavMenu({ categories = [] }: NavMenuProps) {
    const [open, setOpen] = useState(false)
    const menuButton = useRef<HTMLButtonElement>(null)
    const pathname = usePathname()

    const { isLoggedIn } = useAuth()
    const { data: user } = useProfile()
    const favoriteCount = useSavedProductIds().size

    const [lastPath, setLastPath] = useState(pathname)
    if (lastPath !== pathname) {
        setLastPath(pathname)
        setOpen(false)
    }

    useEffect(() => {
        if (!open) return
        const previousOverflow = document.body.style.overflow
        const desktop = window.matchMedia("(min-width: 992px)")
        const onResize = () => { if (desktop.matches) setOpen(false) }
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return
            setOpen(false)
            menuButton.current?.focus()
        }
        document.body.style.overflow = "hidden"
        desktop.addEventListener("change", onResize)
        document.addEventListener("keydown", onKeyDown)
        return () => {
            document.body.style.overflow = previousOverflow
            desktop.removeEventListener("change", onResize)
            document.removeEventListener("keydown", onKeyDown)
        }
    }, [open])

    const closeMenu = () => setOpen(false)

    const active = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href)
    const cls = (href: string) => `${base} ${active(href) ? "bg-white/15 text-white" : "text-[var(--cream)]"}`
    const mcls = (href: string) => `${mbase} ${active(href) ? "bg-soft text-link" : "text-fg"}`

    const links: { href: string; label: string; plain?: boolean }[] = [
        { href: "/", label: "Home" },
        { href: "/#menu", label: "Menu", plain: true },
        { href: "/products", label: "Store" },
        { href: "/about", label: "About" },
        { href: "/articles", label: "Journal" },
        { href: "/contact-us", label: "Contact" },
    ]

    return (
        <>
            <nav aria-label="Main navigation" className="hidden items-center lg:flex 2xl:gap-1">
                {links.map((l) =>
                    l.label === "Store" ? (
                        <div className="group relative" key={l.href}>
                            <Link href={l.href} className={cls(l.href)}>{l.label}</Link>
                            {categories.length > 0 && (
                                <div className="invisible absolute top-full left-0 z-50 min-w-44 rounded-xl border border-line bg-surface p-2 opacity-0 shadow-lg transition duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                                    {categories.map((cat) => (
                                        <Link key={cat._id || cat.name} href={`/products?category=${encodeURIComponent(cat.slug)}`}
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
            </nav>

            <div className="flex items-center gap-1 sm:gap-3">
                <Link href="/#reservation" className="btn btn-outline-light btn-sm hidden sm:inline-flex">
                    <span className="xl:hidden">Book</span><span className="hidden xl:inline">Book a table</span>
                </Link>
                <Link href="/favorites" aria-label={favoriteCount ? `Favorites, ${favoriteCount} items` : "Favorites"} className="relative flex size-10 items-center justify-center rounded-full text-[var(--cream)] hover:bg-white/10">
                    <MdFavoriteBorder size={22} aria-hidden />
                    {favoriteCount > 0 && (
                        <span aria-hidden="true" className="absolute -top-1 -right-1 min-w-4.5 rounded-full bg-[var(--cream)] px-1 text-center text-[11px] leading-[18px] font-semibold text-[var(--navy)]">{favoriteCount}</span>
                    )}
                </Link>
                <CartPreview key={pathname} onOpen={closeMenu} />
                <ThemeToggle />
                <ChristmasToggle />
                {isLoggedIn ? (
                    <Link href="/account" className="btn btn-outline-light btn-sm hidden max-w-32 truncate sm:inline-block sm:leading-[2.15rem]">{user?.name || "My account"}</Link>
                ) : (
                    <Link href="/login-register" className="btn btn-outline-light btn-sm hidden sm:inline-flex">Sign in</Link>
                )}
                <button ref={menuButton} type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-nav"
                    aria-label={open ? "Close menu" : "Open menu"}
                    className={`relative z-50 flex size-11 cursor-pointer items-center justify-center rounded-full border border-solid border-white/30 text-[var(--cream)] transition-colors lg:hidden ${open ? "bg-white/15" : "bg-transparent"}`}>
                    {open ? <MdClose size={20} /> : <MdMenu size={20} />}
                </button>
            </div>

                <div id="mobile-nav" hidden={!open} className="absolute inset-x-0 top-full z-40 h-[calc(100dvh-var(--header-height))] overflow-y-auto overscroll-contain bg-canvas py-6 lg:hidden">
                    <nav aria-label="Mobile navigation" className="container flex flex-col">
                        <Link href="/#reservation" onClick={closeMenu} className="btn btn-primary mb-4 min-h-12">Book a table</Link>
                        {links.map((l) => (
                            <Link key={l.href} href={l.href} onClick={closeMenu} aria-current={!l.plain && active(l.href) ? "page" : undefined} className={`${mcls(l.href)} border-b border-line`}>{l.label}</Link>
                        ))}
                        {categories.length > 0 && (
                            <div className="flex flex-wrap gap-2 border-b border-line py-4">
                                {categories.map((cat) => (
                                    <Link key={cat._id || cat.name} href={`/products?category=${encodeURIComponent(cat.slug)}`} onClick={closeMenu}
                                        className="inline-flex min-h-11 items-center rounded-full border border-line bg-surface px-3 text-sm text-fg">{cat.name}</Link>
                                ))}
                            </div>
                        )}
                        {isLoggedIn ? (
                            <Link href="/account" onClick={closeMenu} className="btn btn-outline mt-3 min-h-11">{user?.name || "My account"}</Link>
                        ) : (
                            <Link href="/login-register" onClick={closeMenu} className="btn btn-outline mt-3 min-h-11">Sign in or create account</Link>
                        )}
                    </nav>
                </div>
        </>
    )
}
