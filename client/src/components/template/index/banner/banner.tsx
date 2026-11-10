"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { SHOP, openStatus } from '@/components/modules/shopInfo'

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]
const ticker = ["Matcha latte", "Sencha", "Flat white", "Masala chai", "Cold brew", "Jasmine pearls", "Cardamom buns", "Oolong"]

function Marquee({ reduce }: { reduce: boolean | null }) {
    const row = [...ticker, ...ticker]
    return (
        <div className="strip-green relative overflow-hidden py-4" aria-hidden>
            <motion.div className="flex w-max items-center gap-8 whitespace-nowrap text-xl font-semibold"
                animate={reduce ? undefined : { x: ["0%", "-50%"] }}
                transition={{ duration: 38, repeat: Infinity, ease: "linear" }}>
                {row.map((t, i) => (
                    <span key={i} className="flex items-center gap-8">
                        {t}
                        <svg viewBox="0 0 24 24" className="size-5 fill-current opacity-70"><path d="M12 2c4 3 7 6 7 10a7 7 0 1 1-14 0c0-4 3-7 7-10z" /></svg>
                    </span>
                ))}
            </motion.div>
        </div>
    )
}

const LAMPS = [
    { left: "5%", cord: 34, w: 40, type: "dome", color: "#f6efe2", delay: 0.2 },
    { left: "22%", cord: 78, w: 34, type: "globe", color: "#f0c27a", delay: 0.55 },
    { left: "40%", cord: 40, w: 46, type: "cone", color: "#3f8f5f", delay: 0.9 },
    { left: "57%", cord: 92, w: 36, type: "globe", color: "#f0c27a", delay: 1.25 },
    { left: "74%", cord: 30, w: 42, type: "dome", color: "#f6efe2", delay: 1.6 },
    { left: "90%", cord: 70, w: 32, type: "cone", color: "#3f8f5f", delay: 1.95 },
]

interface ShadeProps {
    type: string
    w: number
    cord: number
    color: string
}

function Shade({ type, w, cord, color }: ShadeProps) {
    if (type === "globe") {
        const r = w * 0.45
        return (
            <>
                <rect x={w / 2 - 5} y={cord - 6} width="10" height="9" rx="2" fill="var(--navy)" opacity=".7" />
                <circle cx={w / 2} cy={cord + r + 3} r={r} fill={color} />
                <circle cx={w / 2 - r * 0.3} cy={cord + r - 2} r={r * 0.28} fill="#fff" opacity=".55" />
            </>
        )
    }
    if (type === "cone") {
        const h = w * 0.62
        return (
            <>
                <polygon points={`${w * 0.34},${cord} ${w * 0.66},${cord} ${w * 0.96},${cord + h} ${w * 0.04},${cord + h}`} fill={color} />
                <ellipse cx={w / 2} cy={cord + h} rx={w * 0.46} ry="3" fill="#fff6dc" opacity=".9" />
            </>
        )
    }
    const h = w * 0.55
    return (
        <>
            <rect x={w / 2 - 4} y={cord - 6} width="8" height="8" rx="2" fill="var(--navy)" opacity=".7" />
            <path d={`M${w * 0.08} ${cord + h}a${w * 0.42} ${h} 0 0 1 ${w * 0.84} 0z`} fill={color} />
            <rect x={w * 0.04} y={cord + h - 1} width={w * 0.92} height="4" rx="2" fill={color} />
        </>
    )
}

function Lamps() {
    return (
        <>
            {LAMPS.map((l) => {
                const bulbY = l.cord + (l.type === "globe" ? l.w * 0.5 : l.type === "cone" ? l.w * 0.62 : l.w * 0.55)
                const H = bulbY + 8
                return (
                    <div key={l.left} aria-hidden className="lamp max-md:hidden" style={{ left: l.left, width: l.w, animationDelay: `${-l.delay * 3}s` }}>
                        <span className="lamp-glow" style={{ top: bulbY - 70, width: 140, height: 140, left: l.w / 2 - 70, animationDelay: `calc(${l.delay}s + .8s)` }} />
                        <span className="lamp-beam" style={{ top: bulbY, width: 150, height: 170, left: l.w / 2 - 75, animationDelay: `calc(${l.delay}s + .8s)` }} />
                        <svg className="relative" width={l.w} height={H} viewBox={`0 0 ${l.w} ${H}`} style={{ overflow: "visible" }}>
                            <line x1={l.w / 2} y1="0" x2={l.w / 2} y2={l.cord} stroke="var(--navy)" strokeWidth="2" opacity=".55" />
                            <Shade type={l.type} w={l.w} cord={l.cord} color={l.color} />
                        </svg>
                    </div>
                )
            })}
        </>
    )
}

const up = (i = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay: 0.1 + i * 0.1, ease },
})

const items = [
    { src: "/71SmJH0kFLL._SX679_PIbundle-3_TopRight_0_0_AA679SH20_-removebg-preview.png", label: "Tea" },
    { src: "/1380320d-fd67-443b-8079-a55c0ed89ac0_removalai_preview.png", label: "Coffee" },
    { src: "/71Juj7X3KkL._SX679_-removebg-preview.png", label: "Pantry" },
]

export default function Banner() {
    const [status, setStatus] = useState<ReturnType<typeof openStatus> | null>(null)
    const [index, setIndex] = useState(0)
    const [manual, setManual] = useState(false)
    const reduce = useReducedMotion()
    useEffect(() => { setStatus(openStatus()) }, [])
    useEffect(() => {
        if (manual || reduce) return
        const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 4500)
        return () => clearInterval(t)
    }, [manual, reduce])

    const m = (i: number) => (reduce ? {} : up(i))
    const btn = "inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-medium transition hover:-translate-y-0.5"

    return (
        <div className="storefront">
        <Lamps />
        <section className="relative overflow-hidden !py-12 lg:!py-20">
            <div className="container grid items-center gap-12 lg:grid-cols-[1fr_0.95fr] lg:gap-14">
                <div>
                    <motion.p {...m(0)} className="script mb-1 inline-block -rotate-2 text-3xl text-[var(--green)]">Good tea, good mood</motion.p>
                    <motion.h1 {...m(1)} className="mb-5 text-[2.4rem] leading-[1.08] tracking-tight sm:text-5xl" style={{ color: "var(--head)" }}>
                        Your table is waiting under the blue awning.
                    </motion.h1>
                    <motion.p {...m(2)} className="mb-8 max-w-md text-lg leading-relaxed text-muted">
                        A small cafe with warm light, fresh pastries and tea brewed the slow way. The same leaves and cups are for sale in the shop next door.
                    </motion.p>
                    <motion.div {...m(3)} className="mb-8 flex flex-wrap gap-3">
                        <Link href="/#reservation" className={`${btn} bg-brown !text-white shadow-[0_10px_22px_-12px_var(--accent)]`}>Book a table</Link>
                        <Link href="/#menu" className={`${btn} border border-solid border-line bg-surface text-fg`}>See the menu</Link>
                    </motion.div>
                    <motion.p {...m(4)} className="m-0 inline-flex items-center gap-2.5 text-sm text-muted">
                        <span className={`size-2 rounded-full ${status ? (status.open ? "bg-[var(--green)] animate-pulse" : "bg-muted") : "bg-line"}`} aria-hidden />
                        <span className="min-h-5">{status ? status.text : SHOP.address.split(",").slice(0, 2).join(",")}</span>
                    </motion.p>
                </div>

                {/* Tin-lid disc with a rotating inscription and a product that floats above it */}
                <motion.div {...(reduce ? {} : { initial: { opacity: 0, scale: 0.92 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.9, delay: 0.2, ease } })}
                    className="relative mx-auto aspect-square w-full max-w-[520px]">
                    <div className="absolute inset-[7%] rounded-full bg-soft shadow-[inset_0_0_0_1px_var(--line)]" />
                    <div className="absolute inset-[16%] rounded-full bg-surface shadow-[0_30px_60px_-30px_rgba(20,41,90,0.35)]" />

                    <motion.svg viewBox="0 0 200 200" aria-hidden className="absolute inset-0 h-full w-full text-fg"
                        animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}>
                        <defs><path id="hero-ring" d="M100,100 m-90,0 a90,90 0 1,1 180,0 a90,90 0 1,1 -180,0" /></defs>
                        <text fontSize="8.4" textLength="560" lengthAdjust="spacing" fill="currentColor" opacity="0.7" fontFamily="var(--font-next-sans), system-ui">
                            <textPath href="#hero-ring">BREWED TO ORDER  •  SOLD TO TAKE HOME  •  BREWED TO ORDER  •  SOLD TO TAKE HOME  •</textPath>
                        </text>
                    </motion.svg>

                    <div className="absolute inset-[16%]">
                        <AnimatePresence mode="wait">
                            <motion.div key={index} className="absolute inset-0"
                                initial={reduce ? false : { opacity: 0, scale: 0.85, rotate: -6 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9, rotate: 5 }}
                                transition={{ duration: 0.45, ease }}>
                                <motion.img src={items[index].src} alt={`${items[index].label} from the Blue Tea shop`}
                                    className="no-tint h-full w-full object-contain p-[8%] drop-shadow-[0_24px_24px_rgba(20,41,90,0.25)]"
                                    animate={reduce ? undefined : { y: [0, -10, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="absolute -bottom-[3%] left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-solid border-line bg-surface p-1.5 shadow-lg" role="group" aria-label="Featured products">
                        {items.map((it, i) => (
                            <button key={it.label} type="button" aria-pressed={i === index}
                                onClick={() => { setManual(true); setIndex(i) }}
                                className={`cursor-pointer rounded-full border-0 px-4 py-2.5 text-sm font-medium transition-colors ${i === index ? "bg-brown text-white" : "bg-transparent text-muted hover:text-fg"}`}>
                                {it.label}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
        <Marquee reduce={reduce} />
        </div>
    )
}
