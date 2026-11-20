"use client"
import React, { useEffect, useState, useSyncExternalStore } from 'react'
import useIsClient from '@/hooks/useIsClient'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { SHOP, openStatus } from '@/components/modules/shopInfo'
import { formatPrice } from '@/utils/helper'
import type { MenuSection } from '@/types/menu'

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

const DESKTOP = "(min-width: 768px) and (pointer: fine)"
const subscribeDesktop = (onChange: () => void) => {
    const query = window.matchMedia(DESKTOP)
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
}
const useIsDesktop = () => useSyncExternalStore(subscribeDesktop, () => window.matchMedia(DESKTOP).matches, () => false)
const ticker = ["Matcha latte", "Sencha", "Flat white", "Masala chai", "Cold brew", "Jasmine pearls", "Cardamom buns", "Oolong"]

function Marquee({ reduce }: { reduce: boolean | null }) {
    const row = [...ticker, ...ticker]
    return (
        <div className="menu-ribbon" aria-hidden>
            <motion.div className="flex w-max items-center whitespace-nowrap py-5"
                animate={reduce ? undefined : { x: ["0%", "-50%"] }}
                transition={{ duration: 45, repeat: Infinity, ease: "linear" }}>
                {row.map((t, i) => (
                    <span key={i} className="flex items-center">
                        <span className={i % 2 ? "script px-7 text-[1.7rem] leading-none text-[var(--lamp)]" : "font-display px-7 text-xl italic tracking-wide"}>{t}</span>
                        <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-[var(--lamp)] opacity-80" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                            <path d="M9 3c-1.5 1.5 1.5 2.5 0 4M13 3c-1.5 1.5 1.5 2.5 0 4" />
                            <path d="M4 10h13v3a6.5 6.5 0 0 1-13 0v-3Z" fill="currentColor" fillOpacity="0.15" />
                            <path d="M17 11.5h1.5a2.5 2.5 0 0 1 0 5H16" />
                        </svg>
                    </span>
                ))}
            </motion.div>
        </div>
    )
}

function ChalkLine({ className = "" }: { className?: string }) {
    return (
        <svg viewBox="0 0 200 10" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path className="text-[#f4f1e8]" d="M4 6c30-3 60-4 96-2s70 3 96-1" />
        </svg>
    )
}

function ChalkArrow({ className = "" }: { className?: string }) {
    return (
        <svg viewBox="0 0 40 24" className={className} fill="none" stroke="#f4f1e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M3 18c8-10 20-13 33-10M30 3l6 5-7 4" />
        </svg>
    )
}

function ChalkCup({ className = "" }: { className?: string }) {
    return (
        <svg viewBox="0 0 48 48" className={className} fill="none" stroke="#f4f1e8" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M17 6c-3 3 3 5 0 8M24 4c-3 3 3 5 0 8M31 6c-3 3 3 5 0 8" />
            <path d="M8 20h28v6a14 14 0 0 1-28 0v-6Z" />
            <path d="M36 23h3a5 5 0 0 1 0 10h-4M5 44h34" />
        </svg>
    )
}

function ChalkStars({ className = "" }: { className?: string }) {
    return (
        <svg viewBox="0 0 40 40" className={className} fill="none" stroke="#f4f1e8" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M14 4v12M8 10h12M30 22v10M25 27h10M32 5l2 4M6 30l3 2" />
        </svg>
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

const TABS = [
    { key: "cafe", label: "Café" },
    { key: "menu", label: "Menu" },
    { key: "shop", label: "Shop" },
] as const

const SHOP_IMAGE = "/71SmJH0kFLL._SX679_PIbundle-3_TopRight_0_0_AA679SH20_-removebg-preview.png"

export default function Banner({ menu = [] }: { menu?: MenuSection[] }) {
    const isClient = useIsClient()
    const status = isClient ? openStatus() : null
    const [index, setIndex] = useState(0)
    const [manual, setManual] = useState(false)
    const reduce = useReducedMotion()
    const isDesktop = useIsDesktop()
    useEffect(() => {
        if (manual || reduce) return
        const t = setInterval(() => setIndex((i) => (i + 1) % TABS.length), 5500)
        return () => clearInterval(t)
    }, [manual, reduce])

    const m = (i: number) => (reduce ? {} : up(i))
    const featured = menu.flatMap((section) => section.items).slice(0, 4)
    const tab = TABS[index].key
    const btn = "inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-medium transition hover:-translate-y-0.5"

    return (
        <div className="storefront relative z-10 shadow-[0_22px_40px_-24px_rgba(0,0,0,0.45)]">
            <Lamps />
            <section className="relative overflow-hidden !py-8 lg:!py-10">
                <span aria-hidden className="pavement" />
                <div className="container grid items-center gap-12 lg:grid-cols-[1fr_0.95fr] lg:gap-24">
                    <div className="banner-copy">
                        <motion.p {...m(0)} className="script mb-1 inline-block -rotate-2 text-3xl text-[var(--script)]">Good tea, good mood</motion.p>
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

                    <div className="banner-visual relative mx-auto w-full max-w-[420px] pb-12">

                        <motion.span aria-hidden className="aframe-shadow"
                            {...(reduce ? {} : { initial: { opacity: 0, scaleX: 0.5 }, animate: { opacity: 1, scaleX: 1 }, transition: { duration: 1, delay: 0.5, ease } })} />
                        <motion.div className="relative [perspective:1400px]"
                            {...(reduce ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.8, delay: 0.2, ease } })}>
                            <div className="aframe relative" style={{ transform: isDesktop ? "rotateY(-16deg) rotateX(-2deg)" : "none" }}>
                                <div aria-hidden className="aframe-back">
                                    <span className="aframe-rail left-0" />
                                    <span className="aframe-rail right-0" />
                                </div>
                                <div className="aframe-front">
                                    <span aria-hidden className="aframe-rail left-0" />
                                    <span aria-hidden className="aframe-rail right-0" />
                                    <span aria-hidden className="aframe-edge left-0" />
                                    <span aria-hidden className="aframe-edge right-0" />
                                    <span aria-hidden className="aframe-handle" />
                                    <div className="aframe-board">
                                        <div className="chalk relative flex aspect-[4/5] flex-col items-center overflow-hidden px-[9%] pb-[9%] pt-[7%] text-center">
                                            <p className="chalk-text relative m-0 text-[0.62rem] uppercase tracking-[0.28em] opacity-70">Brewed to order · Sold to take home</p>
                                            <ChalkLine className="relative mt-1.5 w-2/3 opacity-60" />
                                            <div className="relative mt-[4%] flex items-center gap-1 sm:gap-3" role="group" aria-label="What we do">
                                                {TABS.map((it, i) => (
                                                    <button key={it.key} type="button" aria-pressed={i === index}
                                                        onClick={() => { setManual(true); setIndex(i) }}
                                                        className={`chalk-tab ${i === index ? "is-active" : ""}`}>
                                                        {i === index && (
                                                            <motion.svg viewBox="0 0 120 50" preserveAspectRatio="none" aria-hidden className="pointer-events-none absolute -inset-x-2 -inset-y-1.5 h-[calc(100%+0.75rem)] w-[calc(100%+1rem)]">
                                                                <motion.path d="M14 30C10 14 40 5 66 6s48 8 44 24-34 16-58 15S16 40 18 26c2-10 20-16 40-17"
                                                                    fill="none" stroke="#f0c27a" strokeWidth="2.2" strokeLinecap="round"
                                                                    initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }}
                                                                    transition={{ duration: 0.6, ease: "easeOut" }} />
                                                            </motion.svg>
                                                        )}
                                                        <span className="relative">{it.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="relative mt-[5%] w-full flex-1">
                                                <AnimatePresence mode="wait">
                                                    <motion.div key={tab} className="absolute inset-0 flex flex-col items-center"
                                                        initial={reduce ? false : { opacity: 0, filter: "blur(4px)" }}
                                                        animate={{ opacity: 1, filter: "blur(0px)" }}
                                                        exit={reduce ? { opacity: 0 } : { opacity: 0, filter: "blur(4px)" }}
                                                        transition={{ duration: 0.45, ease }}>
                                                        {tab === "cafe" && (
                                                            <>
                                                                <p className="chalk-text script m-0 text-[2rem] leading-none">Pull up a chair</p>
                                                                <figure className="chalk-photo relative m-0 mt-[6%] w-[86%] -rotate-2">
                                                                    <span aria-hidden className="chalk-tape left-[-6%] top-[-5%] -rotate-[30deg]" />
                                                                    <span aria-hidden className="chalk-tape right-[-6%] top-[-5%] rotate-[30deg]" />
                                                                    <img src="/images/cafe-seating.jpg" alt="Tables and warm lights inside Blue Tea" className="no-tint aspect-[4/3] w-full object-cover" />
                                                                </figure>
                                                                <p className="chalk-text m-0 mt-auto pt-3 text-sm">Tea, coffee and a seat by the window</p>                                                            </>
                                                        )}
                                                        {tab === "menu" && (
                                                            <>
                                                                <p className="chalk-text script m-0 text-[2rem] leading-none">On the board today</p>
                                                                <ul className="m-0 mt-[8%] w-full list-none space-y-3 p-0">
                                                                    {(featured.length ? featured : [{ _id: "x", name: "Ask us at the counter", price: 0, description: "" }]).map((item) => (
                                                                        <li key={item._id} className="chalk-text flex items-baseline gap-2 text-[0.95rem]">
                                                                            <span className="truncate">{item.name}</span>
                                                                            <span aria-hidden className="flex-1 border-b-2 border-dotted border-white/30" />
                                                                            {item.price ? <span className="font-display">{formatPrice(item.price)}</span> : null}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                                <Link href="/#menu" className="chalk-text mt-auto text-sm underline decoration-dashed underline-offset-4 hover:opacity-80">See the full menu</Link>
                                                            </>
                                                        )}
                                                        {tab === "shop" && (
                                                            <>
                                                                <p className="chalk-text script m-0 text-[2rem] leading-none">Take some home</p>
                                                                <motion.img src={SHOP_IMAGE} alt="Loose-leaf teas from the Blue Tea shop"
                                                                    className="no-tint mt-[4%] h-[62%] w-auto object-contain drop-shadow-[0_18px_18px_rgba(0,0,0,0.35)]"
                                                                    animate={reduce ? undefined : { y: [0, -8, 0] }}
                                                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
                                                                <p className="chalk-text m-0 mt-auto flex items-center gap-2 text-sm">
                                                                    <ChalkArrow className="h-5 w-8 -scale-x-100" />Loose leaf, sold by weight
                                                                </p>
                                                            </>
                                                        )}
                                                    </motion.div>
                                                </AnimatePresence>
                                            </div>
                                            <ChalkCup className="chalk-doodle absolute bottom-[4%] left-[5%] w-[11%]" />
                                            <ChalkStars className="chalk-doodle absolute bottom-[5%] right-[6%] w-[9%]" />
                                        </div>
                                        <span aria-hidden className="aframe-ledge" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </section>
            <Marquee reduce={reduce} />
        </div>
    )
}