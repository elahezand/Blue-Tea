"use client"
import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { MdContentCopy, MdCheck } from "react-icons/md"
import { SectionHeader } from "@/components/modules/motion"

export interface Offer {
    id: string
    value: string
    unit: string
    title: string
    text: string
    code: string
    note: string
}

export const SAMPLE_OFFERS: Offer[] = [
    { id: "o1", value: "20%", unit: "off", title: "Loose-leaf teas", text: "Any two tea jars from the shop.", code: "TEA20", note: "This week only" },
    { id: "o2", value: "2 for 1", unit: "", title: "Morning coffee", text: "Buy one hot drink before 10:00, get one free.", code: "", note: "Weekdays" },
    { id: "o3", value: "$5", unit: "off", title: "Your first order", text: "For new customers, on orders over $30.", code: "HELLO5", note: "One use per customer" },
]

const tones = [
    { name: "paper", cls: "border border-dashed border-[var(--line)] bg-[var(--surface)] text-[var(--fg)]", muted: "text-[var(--muted)]", chip: "bg-[var(--soft)] text-[var(--fg)]", value: "text-[var(--accent-text)]", rotate: -2.5 },
    { name: "board", cls: "board", muted: "text-[var(--cream)]/70", chip: "bg-white/12 text-[var(--cream)]", value: "text-[var(--lamp)]", rotate: 2 },
    { name: "green", cls: "strip-green", muted: "text-white/80", chip: "bg-white/18 text-white", value: "text-white", rotate: -1.5 },
]

function CopyCode({ code, chip }: { code: string; chip: string }) {
    const [done, setDone] = useState(false)
    const copy = async () => {
        try { await navigator.clipboard.writeText(code); setDone(true); setTimeout(() => setDone(false), 1600) } catch { }
    }
    return (
        <button type="button" onClick={copy} aria-label={`Copy code ${code}`}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-full border-none px-3.5 py-1.5 text-sm font-semibold tracking-wider transition active:scale-95 ${chip}`}>
            {code}
            {done ? <MdCheck className="text-base" aria-hidden /> : <MdContentCopy className="text-base opacity-70" aria-hidden />}
            <span className="sr-only" aria-live="polite">{done ? "Copied" : ""}</span>
        </button>
    )
}

function Tag({ offer, index }: { offer: Offer; tone?: unknown; index: number }) {
    const reduce = useReducedMotion()
    const t = tones[index % tones.length]
    return (
        <motion.li className="relative m-0 flex list-none justify-center pt-9" style={{ transformOrigin: "50% 0%" }}
            initial={reduce ? false : { rotate: 16, opacity: 0 }}
            whileInView={{ rotate: t.rotate, opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 70, damping: 6, mass: 1.1, delay: index * 0.18, opacity: { duration: 0.3, delay: index * 0.18 } }}>
            {/* thread from the cord to the tag */}
            <span aria-hidden className="absolute left-1/2 top-0 h-9 w-px -translate-x-1/2 bg-[var(--muted)]/60" />
            <span aria-hidden className="absolute left-1/2 top-[-3px] size-1.5 -translate-x-1/2 rounded-full bg-[var(--muted)]" />
            <motion.div className={`relative flex w-full max-w-[18rem] flex-col rounded-2xl px-6 pb-6 pt-9 shadow-sm ${t.cls}`} style={{ transformOrigin: "50% 0%" }}
                animate={reduce ? undefined : { rotate: [-1.1, 1.1] }}
                transition={{ duration: 3.6 + index * 0.7, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                whileHover={reduce ? undefined : { scale: 1.02 }}>
                {/* punched hole */}
                <span aria-hidden className="absolute left-1/2 top-3 size-3.5 -translate-x-1/2 rounded-full bg-[var(--bg)] shadow-[inset_0_1px_2px_rgb(0_0_0/0.25)]" />
                <div className={`font-display text-5xl font-semibold leading-none ${t.value}`}>
                    {offer.value}{offer.unit && <span className="ms-1.5 text-xl font-medium">{offer.unit}</span>}
                </div>
                <h3 className="mb-1 mt-3 text-lg font-semibold">{offer.title}</h3>
                <p className={`m-0 mb-5 text-sm leading-relaxed ${t.muted}`}>{offer.text}</p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-current/25 pt-4">
                    {offer.code ? <CopyCode code={offer.code} chip={t.chip} /> : <span className={`text-sm ${t.muted}`}>No code needed</span>}
                    {offer.note && <span className={`text-xs ${t.muted}`}>{offer.note}</span>}
                </div>
            </motion.div>
        </motion.li>
    )
}

export default function Offers({ offers = SAMPLE_OFFERS }: { offers?: Offer[] }) {
    const list = offers.slice(0, 3)
    if (!list.length) return null
    return (
        <section className="!py-14 lg:!py-20">
            <div className="container">
                <SectionHeader script="While they last" title="This week's little deals" className="mb-6" />
                <div className="relative mx-auto max-w-5xl">
                    {/* the cord the tags hang from (desktop) */}
                    <span aria-hidden className="absolute inset-x-6 top-[1px] hidden h-px bg-[var(--muted)]/60 lg:block" />
                    <ul className="m-0 grid list-none grid-cols-1 gap-x-10 gap-y-4 p-0 lg:grid-cols-3">
                        {list.map((o, i) => <Tag key={o.id || i} offer={o} index={i} />)}
                    </ul>
                </div>
            </div>
        </section>
    )
}