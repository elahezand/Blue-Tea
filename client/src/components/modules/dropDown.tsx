"use client"
import { useState, type ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { MdExpandMore } from "react-icons/md"

type Tone = "light" | "dark"

const TONE: Record<Tone, Record<"idle" | "open" | "active" | "subIdle" | "subActive", string>> = {
    light: {
        idle: "border-transparent text-fg hover:bg-soft",
        open: "border-line bg-soft text-fg",
        active: "border-transparent bg-[var(--navy)] text-[var(--cream)]",
        subIdle: "text-muted hover:bg-soft hover:text-fg",
        subActive: "bg-[var(--navy)] font-semibold text-[var(--cream)]",
    },
    dark: {
        idle: "border-transparent text-[var(--cream)]/85 hover:bg-white/10",
        open: "border-white/15 bg-white/10 text-white",
        active: "border-transparent bg-[var(--cream)] text-[var(--navy)]",
        subIdle: "text-[var(--cream)]/70 hover:bg-white/10 hover:text-white",
        subActive: "bg-[var(--cream)] font-semibold text-[var(--navy)]",
    },
}
const base = "flex w-full items-center rounded-full border border-solid px-5 py-2.5 text-start text-[15px] font-medium capitalize transition-colors duration-200"

interface NavLinkProps {
    icon: ReactNode
    title: string
    href: string
    exact?: boolean
    tone?: Tone
}

export function NavLink({ icon, title, href, exact = false, tone = "light" }: NavLinkProps) {
    const pathname = usePathname()
    const t = TONE[tone]
    const active = exact ? pathname === href : pathname === href || pathname?.startsWith(href + "/")
    return (
        <li className="mt-1.5 list-none">
            <Link href={href} aria-current={active ? "page" : undefined} className={`${base} ${active ? t.active : t.idle}`}>
                <span className="me-3 flex text-xl">{icon}</span>
                <span className="flex-1">{title}</span>
            </Link>
        </li>
    )
}

interface DropdownProps {
    icon: ReactNode
    title: string
    items?: { href: string; label: string }[]
    tone?: Tone
}

export default function Dropdown({ icon, title, items = [], tone = "light" }: DropdownProps) {
    const pathname = usePathname()
    const t = TONE[tone]
    const hasActive = items.some((i) => pathname === i.href || pathname?.startsWith(i.href + "/"))
    const [open, setOpen] = useState(hasActive)
    const reduce = useReducedMotion()

    if (items.length === 1) return <NavLink icon={icon} title={title} href={items[0].href} tone={tone} />

    return (
        <li className="mt-1.5 list-none">
            <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open}
                className={`${base} cursor-pointer ${open || hasActive ? t.open : t.idle}`}>
                <span className="me-3 flex text-xl">{icon}</span>
                <span className="flex-1">{title}</span>
                <motion.span className="flex text-xl" animate={{ rotate: open ? 180 : 0 }} transition={{ duration: reduce ? 0 : 0.25 }}><MdExpandMore /></motion.span>
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.ul className="m-0 list-none overflow-hidden ps-0"
                        initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
                        {items.map((it) => (
                            <li key={it.href}>
                                <Link href={it.href} aria-current={pathname === it.href ? "page" : undefined}
                                    className={`my-1 ms-5 block rounded-full px-5 py-2 text-sm transition-colors ${pathname === it.href ? t.subActive : t.subIdle}`}>
                                    {it.label}
                                </Link>
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </li>
    )
}
