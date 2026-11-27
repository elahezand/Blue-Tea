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

const TWINE = "#b08d57"
const rotations = [-1.5, 1, -1]

function CopyCode({ code }: { code: string }) {
    const [done, setDone] = useState(false)
    const copy = async () => {
        try { await navigator.clipboard.writeText(code); setDone(true); setTimeout(() => setDone(false), 1600) } catch { }
    }
    return (
        // Looks like a rubber stamp on the tag
        <button type="button" onClick={copy} aria-label={`Copy code ${code}`}
            className="inline-flex -rotate-2 cursor-pointer items-center gap-2 rounded-md border-2 border-dashed border-current/40 bg-transparent px-3 py-1 font-mono text-sm font-bold tracking-[0.18em] text-[var(--offer-ink)] uppercase transition hover:bg-current/5 active:scale-95">
            {code}
            {done ? <MdCheck className="text-base" aria-hidden /> : <MdContentCopy className="text-base opacity-60" aria-hidden />}
            <span className="sr-only" aria-live="polite">{done ? "Copied" : ""}</span>
        </button>
    )
}

function Tag({ offer, index }: { offer: Offer; index: number }) {
    const reduce = useReducedMotion()
    const rotate = rotations[index % rotations.length]
    return (
        <motion.li className="relative m-0 flex list-none justify-center pt-7" style={{ transformOrigin: "50% 0%" }}
            initial={reduce ? false : { rotate: 16, opacity: 0 }}
            whileInView={{ rotate, opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 70, damping: 6, mass: 1.1, delay: index * 0.18, opacity: { duration: 0.3, delay: index * 0.18 } }}>
            {/* Knot on the line and the twine down to the tag */}
            <span aria-hidden className="absolute top-[-4px] left-1/2 size-2 -translate-x-1/2 rounded-full" style={{ background: TWINE }} />
            <span aria-hidden className="absolute top-0 left-1/2 h-[3.25rem] w-px -translate-x-1/2" style={{ background: TWINE }} />

            <motion.div className="offer-tag snow-cap relative w-full max-w-[20rem]" style={{ transformOrigin: "50% 0%" }}
                animate={reduce ? undefined : { rotate: [-1.1, 1.1] }}
                transition={{ duration: 3.6 + index * 0.7, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                whileHover={reduce ? undefined : { scale: 1.02 }}>
                {/* The tag: brown paper with the top corners cut */}
                <div className="relative flex h-full flex-col px-6 pt-11 pb-6 text-[var(--offer-ink)] [clip-path:polygon(14%_0,86%_0,100%_11%,100%_100%,0_100%,0_11%)] [background:var(--offer-paper)]">
                    {/* Punched hole with a reinforcement ring */}
                    <span aria-hidden className="absolute top-4 left-1/2 size-3 -translate-x-1/2 rounded-full bg-[var(--bg)] ring-2 ring-[var(--offer-eyelet)]" />

                    <div className="font-display text-5xl font-semibold leading-none text-[var(--gold-text)] tabular-nums">
                        {offer.value}{offer.unit && <span className="ms-1.5 text-xl font-medium">{offer.unit}</span>}
                    </div>
                    <h3 className="mt-3 mb-1 text-lg font-semibold text-[var(--offer-ink)]">{offer.title}</h3>
                    <p className="m-0 mb-3 text-sm leading-relaxed opacity-75">{offer.text}</p>
                    {offer.note && <p className="m-0 mb-4 text-xs font-semibold text-[var(--accent)]">{offer.note}</p>}
                    <div className="mt-auto border-0 border-t border-dashed border-current/25 pt-3">
                        {offer.code ? <CopyCode code={offer.code} /> : <span className="text-sm font-medium opacity-70">No code needed, just ask</span>}
                    </div>
                </div>
            </motion.div>
        </motion.li>
    )
}

export default function Offers({ offers = SAMPLE_OFFERS }: { offers?: Offer[] }) {
    const list = offers.slice(0, 3)
    if (!list.length) return null
    return (
        <section>
            <div className="container">
                <SectionHeader script="While they last" title="This week's little deals" className="mb-6" />
                <div className="relative mx-auto max-w-5xl">
                    {/* The twine the tags hang from (desktop) */}
                    <span aria-hidden className="absolute inset-x-6 top-0 hidden h-[2px] lg:block" style={{ background: TWINE }} />
                    <ul className="m-0 grid list-none grid-cols-1 gap-x-10 gap-y-6 p-0 lg:grid-cols-3">
                        {list.map((o, i) => <Tag key={o.id || i} offer={o} index={i} />)}
                    </ul>
                </div>
            </div>
        </section>
    )
}
