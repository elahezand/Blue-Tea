"use client"
import { useEffect, useState } from 'react'
import useIsClient from '@/hooks/useIsClient'
import Link from 'next/link'
import Image from "next/image"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { SHOP, openStatus } from '@/components/modules/shopInfo'
import { Float } from "@/components/modules/motion"
import { formatPrice } from '@/utils/helper'
import type { MenuSection } from '@/types/menu'

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

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
    { left: "40%", cord: 40, w: 46, type: "cone", color: "#21663A", delay: 0.9 },
    { left: "57%", cord: 92, w: 36, type: "globe", color: "#f0c27a", delay: 1.25 },
    { left: "74%", cord: 30, w: 42, type: "dome", color: "#f6efe2", delay: 1.6 },
    { left: "90%", cord: 70, w: 32, type: "cone", color: "#21663A", delay: 1.95 },
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
const BOARD_PAGE_SIZE = 3
const CAFE_PHOTO_SIZES = "(min-width: 1480px) 690px, (min-width: 1024px) 49vw, (min-width: 740px) 680px, 100vw"
const CAFE_PHOTOS = [
    { src: "/images/blue-tea-cafe-window-view.webp", winter: "/images/blue-tea-cafe-christmas-trees.webp", alt: "Warm lights and tables inside Blue Tea" },
    { src: "/images/blue-tea-cafe-entrance.webp", winter: "/images/blue-tea-cafe-entrance-snow.webp", alt: "Blue Tea Café entrance with navy doors" },
]

export default function Banner({ menu = [] }: { menu?: MenuSection[] }) {
    const isClient = useIsClient()
    const status = isClient ? openStatus() : null
    const [index, setIndex] = useState(0)
    const [menuPage, setMenuPage] = useState(0)
    const [photoIndex, setPhotoIndex] = useState(0)
    const reduce = useReducedMotion()

    const m = (i: number) => (reduce ? {} : up(i))
    const menuItems = menu.flatMap((section) => section.items)
    const menuPageCount = Math.ceil(menuItems.length / BOARD_PAGE_SIZE)
    const menuStart = (menuPage % Math.max(menuPageCount, 1)) * BOARD_PAGE_SIZE
    const featured = menuItems.slice(menuStart, menuStart + BOARD_PAGE_SIZE)
    const tab = TABS[index].key

    useEffect(() => {
        if (!isClient || reduce) return
        const interval = window.setInterval(() => {
            setPhotoIndex((current) => (current + 1) % CAFE_PHOTOS.length)
        }, 6500)
        return () => window.clearInterval(interval)
    }, [isClient, reduce])

    useEffect(() => {
        if (tab !== "menu" || menuPageCount < 2 || reduce) return
        const interval = window.setInterval(() => {
            setMenuPage((page) => (page + 1) % menuPageCount)
        }, 7000)
        return () => window.clearInterval(interval)
    }, [tab, menuPageCount, reduce])

    return (
        <div className="storefront relative z-10">
            <Lamps />
            <section className="relative !py-10 lg:!py-16 lg:!pb-23">
                <div className="container grid items-center gap-8 !max-w-[1480px] !px-5 sm:!px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] lg:gap-8 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] xl:gap-10 xl:!px-12">
                    <div className="banner-copy">
                        <motion.p {...m(0)} className="script mb-4 inline-block -rotate-2 text-3xl text-[var(--script)]">Good tea, good mood</motion.p>
                        <motion.h1 {...m(1)} className="mb-5 max-w-[22ch] text-[2.625rem] font-medium tracking-tight text-[var(--head)] md:text-[3.5rem]">
                            Your table is waiting under the blue awning.
                        </motion.h1>
                        <motion.p {...m(2)} className="mb-7 max-w-md text-base leading-relaxed text-muted sm:text-lg">
                            A café for slow-brewed tea, coffee and fresh pastries. Bring your favorite leaves home from the shop.
                        </motion.p>
                        <motion.div {...m(3)} className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-1">
                            <Link href="/#reservation" className="btn btn-primary min-h-13 !px-7 !text-base">Book a table</Link>
                            <Link href="/#menu" className="inline-flex min-h-11 items-center text-sm font-medium text-link underline underline-offset-4 hover:text-fg">View menu</Link>
                            <Link href="/products" className="inline-flex min-h-11 items-center text-sm font-medium text-link underline underline-offset-4 hover:text-fg">Shop online</Link>
                        </motion.div>
                        <motion.p {...m(4)} className="m-0 inline-flex items-center gap-2.5 text-sm text-muted">
                            <span className={`size-2 rounded-full ${status ? (status.open ? "bg-[var(--green)]" : "bg-muted") : "bg-line"}`} aria-hidden />
                            <span className="min-h-5">{status ? status.text : SHOP.address.split(",").slice(0, 2).join(",")}</span>
                        </motion.p>
                    </div>

                    <div className="relative mx-auto grid w-full min-w-0 max-w-[680px] gap-4 lg:mx-0 lg:max-w-none lg:grid-cols-[minmax(0,1fr)_clamp(13.75rem,16vw,15.5rem)] lg:gap-0 lg:pb-7">
                        <Float amount={7} className="w-full lg:w-[calc(100%+1.5rem)] lg:self-start">
                          <div className="banner-cafe-photo polaroid polaroid-static relative w-full">
                            <span aria-hidden className="tape tape-sm -top-2 left-1 z-10 -rotate-[28deg]" />
                            <span aria-hidden className="tape tape-sm -bottom-2 right-2 z-10 -rotate-[28deg] lg:right-16" />
                            <div className="relative aspect-[1672/941] overflow-hidden bg-soft lg:aspect-[16/10]">
                                {CAFE_PHOTOS.map((photo, photoNumber) => (
                                    <div key={photo.src} aria-hidden={photoIndex !== photoNumber}
                                        className={`absolute inset-0 motion-safe:transition-opacity motion-safe:duration-[1400ms] motion-safe:ease-in-out ${photoNumber === 0 || photoIndex === photoNumber ? "opacity-100" : "opacity-0"}`}>
                                        <Image src={photo.src} alt={photo.alt} fill priority={photoNumber === 0}
                                            sizes={CAFE_PHOTO_SIZES} className="no-tint object-cover" />
                                        <Image src={photo.winter} alt="" fill sizes={CAFE_PHOTO_SIZES}
                                            className="christmas-photo no-tint object-cover object-right" />
                                    </div>
                                ))}
                            </div>
                          </div>
                        </Float>


                        <div className="banner-visual relative z-10 mb-2 w-[78%] max-w-[270px] justify-self-end lg:mb-0 lg:w-full lg:self-end lg:translate-y-12">
                            <motion.span aria-hidden className="aframe-shadow"
                                {...(reduce ? {} : { initial: { opacity: 0, scaleX: 0.5 }, animate: { opacity: 1, scaleX: 1 }, transition: { duration: 1, delay: 0.5, ease } })} />
                            <motion.div className="relative [perspective:1400px]"
                                {...(reduce ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.8, delay: 0.2, ease } })}>
                                <div className="aframe relative lg:[transform:rotateY(-16deg)_rotateX(-2deg)]">
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
                                            <div className="chalk relative flex aspect-[2/3] flex-col items-center overflow-hidden px-[10%] pb-[10%] pt-[8%] text-center sm:aspect-[10/13] lg:aspect-[2/3] lg:px-[7%] lg:pb-[7%] lg:pt-[7%] xl:aspect-[3/4]">
                                                <p className="chalk-text relative m-0 text-[0.62rem] uppercase tracking-[0.28em] opacity-70">Brewed to order · Sold to take home</p>
                                                <ChalkLine className="relative mt-1.5 w-2/3 opacity-60" />
                                                <div className="relative mt-[4%] flex items-center gap-1 sm:gap-3" role="group" aria-label="What we do">
                                                    {TABS.map((it, i) => (
                                                        <button key={it.key} type="button" aria-pressed={i === index}
                                                            onClick={() => setIndex(i)}
                                                            className={`chalk-tab ${i === index ? "is-active" : ""}`}>
                                                            {i === index && (
                                                                <motion.svg viewBox="0 0 120 50" preserveAspectRatio="none" aria-hidden className="pointer-events-none absolute -inset-x-2 -inset-y-1.5 h-[calc(100%+0.75rem)] w-[calc(100%+1rem)]">
                                                                    <motion.path d="M14 30C10 14 40 5 66 6s48 8 44 24-34 16-58 15S16 40 18 26c2-10 20-16 40-17"
                                                                        fill="none" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round"
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
                                                                    <p className="chalk-text script m-0 text-2xl leading-none">Opening hours</p>
                                                                    <dl className="m-0 mt-[5%] w-full divide-y divide-white/20 px-1 text-start text-xs">
                                                                        {SHOP.hours.map(({ days, time }) => (
                                                                            <div key={days} className="chalk-text flex justify-between gap-2 py-1.5">
                                                                                <dt>{days}</dt>
                                                                                <dd className="m-0 shrink-0 tabular-nums">{time}</dd>
                                                                            </div>
                                                                        ))}
                                                                    </dl>
                                                                    <Link href="/#reservation" className="chalk-text mt-auto inline-flex min-h-8 items-center text-xs underline decoration-dashed underline-offset-4 hover:opacity-80">
                                                                        Book a table
                                                                    </Link>
                                                                </>
                                                            )}
                                                            {tab === "menu" && (
                                                                <>
                                                                    <p className="chalk-text script m-0 text-2xl leading-none">On the board today</p>
                                                                    <ul className="m-0 mt-[5%] w-full list-none space-y-1.5 p-0">
                                                                        {(featured.length ? featured : [{ _id: "x", name: "Ask us at the counter", price: 0, description: "" }]).map((item) => (
                                                                            <li key={item._id} className="chalk-text flex items-baseline gap-2 text-xs">
                                                                                <span className="min-w-0 truncate" title={item.name}>{item.name}</span>
                                                                                <span aria-hidden className="flex-1 border-b-2 border-dotted border-white/30" />
                                                                                {item.price ? <span className="font-display">{formatPrice(item.price)}</span> : null}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                    <Link href="/#menu" className="chalk-text mt-auto inline-flex min-h-8 items-center text-xs underline decoration-dashed underline-offset-4 hover:opacity-80">See the full menu</Link>
                                                                </>
                                                            )}
                                                            {tab === "shop" && (
                                                                <>
                                                                    <p className="chalk-text script m-0 text-2xl leading-none">Take some home</p>
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
                </div>
            </section>
        </div>
    )
}
