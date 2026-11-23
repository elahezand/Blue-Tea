"use client"
import { useState, type KeyboardEvent } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { formatPrice } from "@/utils/helper"

const tabDirections: Partial<Record<string, number>> = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 }

export interface MenuGroup {
    id: string
    name: string
    items: { id: string; name: string; description: string; price: number; size?: string; img?: string }[]
}

export default function MenuTabs({ groups }: { groups: MenuGroup[] }) {
    const [active, setActive] = useState<string | undefined>(groups[0]?.id)
    const [preview, setPreview] = useState<string | null>(null)
    const reduce = useReducedMotion()
    const group = groups.find((g) => g.id === active) || groups[0]
    if (!group) return null
    const previewImage = preview ?? group.items.find((item) => item.img)?.img

    const select = (id: string) => {
        setActive(id)
        setPreview(null)
    }

    const moveTab = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
        const direction = tabDirections[event.key]
        const next = event.key === "Home" ? 0 : event.key === "End" ? groups.length - 1 :
            direction ? (index + direction + groups.length) % groups.length : null
        if (next === null) return
        event.preventDefault()
        const tab = groups[next]
        select(tab.id)
        document.getElementById(`tab-${tab.id}`)?.focus()
    }

    return (
        <div className="cafe-menu-board overflow-hidden">
            <div className="container grid items-start gap-5 !px-4 py-6 sm:gap-8 sm:!px-7 sm:py-8 lg:!max-w-[1560px] lg:grid-cols-[clamp(11rem,17vw,16rem)_minmax(0,1fr)] lg:gap-6 lg:!pl-4 lg:!pr-8 lg:py-10">
                <div role="tablist" aria-label="Menu categories" className="flex min-w-0 flex-wrap gap-2 lg:flex-col lg:flex-nowrap">
                    {groups.map((category, index) => {
                        const selected = category.id === group.id
                        return (
                            <button
                                key={category.id}
                                id={`tab-${category.id}`}
                                type="button"
                                role="tab"
                                aria-selected={selected}
                                aria-controls="menu-category-panel"
                                tabIndex={selected ? 0 : -1}
                                onClick={() => select(category.id)}
                                onKeyDown={(event) => moveTab(event, index)}
                                className={`flex min-h-11 max-w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-solid px-3 py-1 text-left transition-colors focus-visible:!outline-[var(--menu-accent)] sm:px-4 ${selected ? "border-[var(--menu-accent)]/50 bg-[var(--menu-accent)]/12 text-[var(--menu-accent)]" : "border-transparent text-[var(--menu-muted)] hover:bg-[var(--menu-ink)]/7 hover:text-[var(--menu-ink)]"}`}
                            >
                                <span className="script text-xl leading-tight sm:text-2xl">{category.name}</span>
                                <span className="hidden text-xs tabular-nums opacity-75 lg:inline">{category.items.length}</span>
                            </button>
                        )
                    })}
                </div>

                <div
                    role="tabpanel"
                    id="menu-category-panel"
                    aria-labelledby={`tab-${group.id}`}
                    tabIndex={0}
                    className={`grid min-w-0 items-start gap-7 border-0 border-t border-solid border-[var(--menu-rule)] pt-2 focus-visible:!outline-[var(--menu-accent)] lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6 xl:gap-10 ${previewImage ? "lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)]" : ""}`}
                >
                    <motion.ul
                        key={group.id}
                        initial={reduce ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: reduce ? 0 : 0.2 }}
                        onMouseLeave={() => setPreview(null)}
                        className="m-0 list-none p-0"
                    >
                        {group.items.map((item) => (
                            <li key={item.id} onMouseEnter={() => setPreview(item.img || null)} className="flex items-start gap-3 border-0 border-b border-solid border-[var(--menu-rule)] py-3.5 last:border-b-0 first:pt-0 sm:items-center sm:gap-4">
                                {item.img && (
                                    <img src={item.img} alt="" loading="lazy" className="no-tint size-12 shrink-0 rounded-lg object-cover sm:size-14 lg:hidden" />
                                )}
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-baseline justify-between gap-2">
                                        <h3 className="m-0 min-w-0 font-body text-base font-medium text-[var(--menu-ink)] sm:text-lg">
                                            {item.name}
                                            {item.size && <span className="ms-2 text-xs text-[var(--menu-muted)]">{item.size}</span>}
                                        </h3>
                                        <span className="shrink-0 text-sm font-semibold text-[var(--menu-accent)] tabular-nums sm:text-base">{formatPrice(item.price)}</span>
                                    </div>
                                    {item.description && <p className="mt-0.5 mb-0 max-w-[44ch] text-sm leading-relaxed text-[var(--menu-muted)]">{item.description}</p>}
                                </div>
                            </li>
                        ))}
                    </motion.ul>
                    {previewImage && (
                        <div aria-hidden className="no-tint pointer-events-none relative hidden min-h-80 self-stretch overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_24%)] lg:-my-10 lg:-mr-8 lg:block">
                            <motion.img
                                key={previewImage}
                                src={previewImage}
                                alt=""
                                initial={reduce ? false : { opacity: 0 }}
                                animate={{ opacity: 0.92 }}
                                transition={{ duration: reduce ? 0 : 0.18 }}
                                className="no-tint absolute inset-0 size-full object-cover"
                            />
                            <span className="absolute inset-0 bg-linear-to-t from-[var(--menu-back)]/65 via-transparent to-[var(--menu-back)]/15" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
