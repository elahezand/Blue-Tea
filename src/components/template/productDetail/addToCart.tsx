"use client"
import { useEffect, useRef, useState } from 'react'
import { MdFavoriteBorder } from 'react-icons/md'
import type { ID } from '@/types/models'

/* product.price is treated as the price for BASE_GRAMS. Change it here if your prices are per kg etc. */
export const BASE_GRAMS = 100
const DEFAULT_PRESETS = [50, 100, 250, 500, 1000]

/* "100g, 250g, 0.5kg" (or an array of those) -> [100, 250, 500]. Anything unreadable is skipped. */
export function parseVariants(v: string | string[] | null | undefined): number[] {
    const list = Array.isArray(v) ? v : String(v || "").split(/[,;\n]/)
    const out = list.map((x) => {
        const m = String(x).trim().toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(kg|g|gr|gram|grams)?$/)
        if (!m) return null
        const n = parseFloat(m[1])
        return Math.round(m[2] === "kg" ? n * 1000 : n)
    }).filter((n): n is number => n !== null && n > 0 && n <= 20000)
    return [...new Set(out)].sort((a, b) => a - b)
}

const money = (n: number) => (Math.round(n * 100) / 100).toString()
const label = (g: number) => (g >= 1000 && g % 1000 === 0 ? `${g / 1000} kg` : `${g} g`)

interface AddToCartProps {
    productID: ID
    img: string
    name: string
    price: number
    variants?: string | string[]
}

export default function AddToCart({ productID, img, name, price, variants }: AddToCartProps) {
    const parsed = parseVariants(variants)
    const PRESETS = parsed.length ? parsed : DEFAULT_PRESETS
    const addToFavorites = () => {
        // TODO: add-to-favorites request (removed for now), payload: { productID }
    }
    const [grams, setGrams] = useState(() => PRESETS.find((g) => g >= 250) || PRESETS[PRESETS.length - 1])
    const [stuck, setStuck] = useState(false)
    const anchor = useRef<HTMLDivElement>(null)

    const total = money((price * grams) / BASE_GRAMS)

    useEffect(() => {
        const el = anchor.current
        if (!el || !("IntersectionObserver" in window)) return
        const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 })
        io.observe(el)
        return () => io.disconnect()
    }, [])

    const set = (g: number) => setGrams(g)

    const add = () => {
        // TODO: add-to-cart request (removed for now), payload: { product: productID, grams, quantity: 1 }
        // One line = one pack of the chosen weight; the cart's own +/- changes how many packs.
        void img
    }

    return (
        <>
        <div className="mb-6">
            <div className="mb-2 flex items-baseline justify-between">
                <span id="grams-label" className="text-sm font-medium text-fg">How much?</span>
                <span className="text-xs text-muted">${price} per {BASE_GRAMS} g</span>
            </div>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="grams-label">
                {PRESETS.map((g) => (
                    <button key={g} type="button" role="radio" aria-checked={grams === g} onClick={() => set(g)}
                        className={`h-10 cursor-pointer rounded-full border border-solid px-4 text-sm font-medium transition ${grams === g ? "border-brown bg-brown !text-white" : "border-line bg-surface text-fg hover:border-brown/50"}`}>
                        {label(g)}
                    </button>
                ))}
            </div>
        </div>

        <div ref={anchor} className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={add}
                className="btn-organic h-12 flex-1 border-transparent bg-brown px-8 text-sm font-medium !text-white">
                Add {label(grams)} to cart · ${total}
            </button>
            <button type="button" onClick={addToFavorites} aria-label="Add to favorites"
                className="btn-organic flex size-12 items-center justify-center bg-surface text-xl text-fg hover:!border-berry/50 hover:text-berry disabled:cursor-wait disabled:opacity-60"><MdFavoriteBorder /></button>
        </div>

        <div aria-hidden={!stuck} className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas/90 px-4 py-3 backdrop-blur-xl transition-transform duration-300 lg:hidden ${stuck ? "translate-y-0" : "translate-y-full"}`}>
            <div className="container flex items-center gap-4 !px-0">
                <div className="min-w-0 flex-1">
                    <p className="m-0 truncate text-sm font-medium text-fg">{name} · {label(grams)}</p>
                    <p className="m-0 font-display text-lg font-semibold text-fg">${total}</p>
                </div>
                <button type="button" tabIndex={stuck ? 0 : -1} onClick={add}
                    className="btn-organic h-11 shrink-0 border-transparent bg-brown px-7 text-sm font-medium !text-white">
                    Add to cart
                </button>
            </div>
        </div>
        </>
    )
}
