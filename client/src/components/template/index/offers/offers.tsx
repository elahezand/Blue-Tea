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

// Brown paper price tags on a string, same paper feel as the tape on the photos.
// The tag keeps its paper colours in dark mode too, like a real tag would.
const INK = "#14295a"
const TWINE = "#b08d57"
const rotations = [-3, 2.5, -1.5]

function CopyCode({ code }: { code: string }) {
    const [done, setDone] = useState(false)
    const copy = async () => {
        try { await navigator.clipboard.writeText(code); setDone(true); setTimeout(() => setDone(false), 1600) } catch { }
    }
    return (
        // Looks like a rubber stamp on the tag
        <button type="button" onClick={copy} aria-label={`Copy code ${code}`}
            className="inline-flex -rotate-2 cursor-pointer items-center gap-2 rounded-md border-2 border-dashed bg-transparent px-3 py-1 font-mono text-sm font-bold tracking-[0.18em] uppercase transition hover:bg-black/5 active:scale-95"
            style={{ color: INK, borderColor: `${INK}66` }}>
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
        <motion.li className="relative m-0 flex list-none justify-center pt-10" style={{ transformOrigin: "50% 0%" }}
            initial={reduce ? false : { rotate: 16, opacity: 0 }}
            whileInView={{ rotate, opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 70, damping: 6, mass: 1.1, delay: index * 0.18, opacity: { duration: 0.3, delay: index * 0.18 } }}>
            {/* Knot on the line and the twine down to the tag */}
            <span aria-hidden className="absolute top-[-4px] left-1/2 size-2 -translate-x-1/2 rounded-full" style={{ background: TWINE }} />
            <span aria-hidden className="absolute top-0 left-1/2 h-[3.75rem] w-[2px] -translate-x-1/2" style={{ background: TWINE }} />

            <motion.div className="relative w-full max-w-[18rem] [filter:drop-shadow(0_14px_16px_rgba(20,41,90,0.18))]" style={{ transformOrigin: "50% 0%" }}
                animate={reduce ? undefined : { rotate: [-1.1, 1.1] }}
                transition={{ duration: 3.6 + index * 0.7, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                whileHover={reduce ? undefined : { scale: 1.02 }}>
                {/* The tag: brown paper with the top corners cut */}
                <div className="relative flex flex-col px-7 pt-12 pb-7 [clip-path:polygon(22%_0,78%_0,100%_14%,100%_100%,0_100%,0_14%)] [background:linear-gradient(170deg,#ecdbb4,#dcc391_60%,#d4b882)]"
                    style={{ color: INK }}>
                    {/* Punched hole with a reinforcement ring */}
                    <span aria-hidden className="absolute top-4 left-1/2 size-4 -translate-x-1/2 rounded-full bg-[var(--bg)] ring-[5px] ring-[#c9ad74] shadow-[inset_0_1px_2px_rgb(0_0_0/0.3)]" />

                    {offer.note && <span className="script -rotate-3 self-start text-2xl leading-none text-[#2d6e47]">{offer.note}</span>}
                    <div className="mt-2 font-display text-5xl font-semibold leading-none">
                        {offer.value}{offer.unit && <span className="ms-1.5 text-xl font-medium">{offer.unit}</span>}
                    </div>
                    <h3 className="mt-3 mb-1 text-lg font-semibold" style={{ color: INK }}>{offer.title}</h3>
                    <p className="m-0 mb-5 text-sm leading-relaxed opacity-75">{offer.text}</p>
                    <div className="mt-auto border-0 border-t border-dashed pt-4" style={{ borderColor: `${INK}40` }}>
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