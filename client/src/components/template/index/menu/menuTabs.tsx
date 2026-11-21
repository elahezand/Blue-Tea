"use client"
import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

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

    return (
        <motion.div className="board relative overflow-hidden !rounded-none !border-0 !shadow-none"
            initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7, ease }}>

            {/* Photo of the hovered item. Mobile: the whole board. Desktop: the right side, fading into the board */}
            <AnimatePresence>
                {preview && (
                    <motion.div key={preview} aria-hidden className="pointer-events-none absolute inset-0 lg:left-auto lg:w-[65%] lg:[mask-image:linear-gradient(to_right,transparent,black_35%)]"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease }}>
                        <motion.img src={preview} alt="" className="no-tint size-full object-cover object-[center_70%]"
                            initial={reduce ? false : { scale: 1.04 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease }} />
                        <span className="absolute inset-0 bg-[var(--navy)]/60" />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container relative z-10 grid min-h-[600px] items-center gap-8 py-14 sm:py-16 lg:min-h-[720px] lg:grid-cols-[0.8fr_1.2fr] lg:gap-14 lg:py-24">
            <div className="min-w-0">
                <h2 className="script m-0 text-4xl !font-semibold text-[var(--lamp)] sm:text-5xl">Today&apos;s menu</h2>
                <p className="mt-2 mb-7 max-w-xs text-sm leading-relaxed text-[var(--cream)]/75">Everything is brewed to order. Ask at the counter what is fresh from the oven.</p>

                {/* Sections: a hand-written list, the chalk line slides to the open one. Wraps on mobile so all are seen */}
                <div role="tablist" aria-label="Menu categories"
                    className="flex flex-wrap gap-x-5 gap-y-3 lg:flex-col lg:flex-nowrap lg:gap-4">
                    {groups.map((g, i) => {
                        const on = g.id === group.id
                        return (
                            <button key={g.id} role="tab" id={`tab-${g.id}`} aria-selected={on} aria-controls={`panel-${g.id}`}
                                onClick={() => { setActive(g.id); setPreview(null) }}
                                className={`group/tab flex shrink-0 cursor-pointer items-baseline gap-2.5 border-0 bg-transparent p-0 text-left transition-colors ${on ? "text-[var(--cream)]" : "text-[var(--cream)]/50 hover:text-[var(--cream)]/85"}`}>
                                <span className={`font-body text-[11px] tracking-[0.2em] transition-colors ${on ? "text-[var(--lamp)]" : ""}`}>
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <span className="script relative whitespace-nowrap pb-2 text-xl leading-none sm:text-3xl">
                                    {g.name}
                                    {on && (
                                        <motion.svg layoutId="menu-tab-chalk" aria-hidden viewBox="0 0 120 10" preserveAspectRatio="none"
                                            className="absolute bottom-0 left-0 h-2.5 w-full text-[var(--lamp)]"
                                            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}>
                                            <path d="M2 6 C 25 2, 50 9, 75 5 S 110 3, 118 6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                        </motion.svg>
                                    )}
                                </span>
                                <span className="font-body text-xs opacity-60">{g.items.length}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div key={group.id} role="tabpanel" id={`panel-${group.id}`} aria-labelledby={`tab-${group.id}`}
                    initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }} transition={{ duration: 0.26, ease }}>
                    {group.items.length === 0 ? (
                        <p className="text-[var(--cream)]/75">Nothing in this category yet.</p>
                    ) : (
                        <motion.ul initial="hidden" animate="show" className="m-0 list-none p-0" onMouseLeave={() => setPreview(null)}
                            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}>
                            {group.items.map((it) => (
                                <motion.li key={it.id} tabIndex={0}
                                    onMouseEnter={() => setPreview(it.img || null)} onFocus={() => setPreview(it.img || null)} onBlur={() => setPreview(null)}
                                    variants={{ hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease } } }}
                                    className="group flex items-center gap-4 py-3 outline-none">
                                    <div className="size-12 shrink-0 overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/15 sm:size-14">
                                        {it.img && <img src={it.img} alt={it.name} loading="lazy"
                                            className="no-tint size-full object-cover transition-transform duration-500 group-hover:scale-110" />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-baseline gap-3">
                                            <h3 className="m-0 font-body text-lg font-normal text-[var(--cream)]">
                                                {it.name}{it.size && <span className="ms-2 text-xs text-[var(--cream)]/55">{it.size}</span>}
                                            </h3>
                                            <span aria-hidden className="min-w-6 flex-1 -translate-y-1 border-b-[1.5px] border-dotted border-[var(--cream)]/35"></span>
                                            <span className="script text-2xl text-[var(--lamp)]">${it.price}</span>
                                        </div>
                                        {it.description && <p className="mt-0.5 mb-0 max-w-[44ch] text-sm leading-relaxed text-[var(--cream)]/65">{it.description}</p>}
                                    </div>
                                </motion.li>
                            ))}
                        </motion.ul>
                    )}
                </motion.div>
            </AnimatePresence>
            </div>
        </motion.div>
    )
}