"use client"
import { usePathname } from "next/navigation"

const NAMES: Record<string, string> = { "detail-account": "Account", contacts: "Contact messages", menu: "Menu items" }
export default function PanelTitle() {
    const seg = (usePathname() || "").split("/").filter(Boolean)[1]
    const raw = seg || "dashboard"
    const title = NAMES[raw] || raw.charAt(0).toUpperCase() + raw.slice(1)
    return (
        <div className="ptitle min-w-0 transition-[padding] duration-300">
            <span className="script block text-2xl leading-none text-[var(--script)]">Behind the counter</span>
            <h1 className="m-0 truncate text-2xl leading-tight md:text-3xl" style={{ color: "var(--head)" }}>{title}</h1>
        </div>
    )
}