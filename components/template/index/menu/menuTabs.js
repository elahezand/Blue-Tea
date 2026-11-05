"use client"
import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

const ease = [0.22, 1, 0.36, 1]

/* The menu as the chalkboard behind the counter: categories on the left, prices in handwriting on the right */
export default function MenuTabs({ groups }) {
    const [active, setActive] = useState(groups[0]?.id)
    const reduce = useReducedMotion()
    const group = groups.find((g) => g.id === active) || groups[0]
    if (!group) return null

    return (
        <motion.div className="board grid gap-10 p-7 sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14 lg:p-14"
            initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7, ease }}>
            <div>
                <h2 className="script m-0 text-4xl !font-semibold text-[var(--lamp)] sm:text-5xl">Today&apos;s menu</h2>
                <p className="mt-2 mb-6 max-w-xs text-sm leading-relaxed text-[var(--cream)]/75">Everything is brewed to order. Ask at the counter what is fresh from the oven.</p>
                <div role="tablist" aria-label="Menu categories" className="flex flex-wrap gap-2 lg:flex-col lg:items-start">
                    {groups.map((g) => {
                        const on = g.id === group.id
                        return (
                            <button key={g.id} role="tab" id={`tab-${g.id}`} aria-selected={on} aria-controls={`panel-${g.id}`}
                                onClick={() => setActive(g.id)}
                                className={`cursor-pointer rounded-full border border-solid px-4 py-2 text-sm font-medium transition-colors ${on ? "border-[var(--cream)] bg-[var(--cream)] text-[var(--navy)]" : "border-white/25 bg-transparent text-[var(--cream)] hover:bg-white/10"}`}>
                                {g.name}
                                <span className="ms-2 text-xs opacity-60">{g.items.length}</span>
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
                        <motion.ul initial="hidden" animate="show" className="m-0 list-none p-0"
                            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}>
                            {group.items.map((it) => (
                                <motion.li key={it.id}
                                    variants={{ hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease } } }}
                                    className="py-3">
                                    <div className="flex items-baseline gap-3">
                                        <h3 className="m-0 font-body text-lg font-normal text-[var(--cream)]">{it.name}</h3>
                                        <span aria-hidden className="min-w-6 flex-1 -translate-y-1 border-b-[1.5px] border-dotted border-[var(--cream)]/35"></span>
                                        <span className="script text-2xl text-[var(--lamp)]">${it.price}</span>
                                    </div>
                                    {it.description && <p className="mt-0.5 mb-0 max-w-[44ch] text-sm leading-relaxed text-[var(--cream)]/65">{it.description}</p>}
                                </motion.li>
                            ))}
                        </motion.ul>
                    )}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    )
}
