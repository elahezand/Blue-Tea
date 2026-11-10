"use client"
import { useEffect, useRef, useState } from 'react'
import { MdFavoriteBorder } from 'react-icons/md'
import { useAddItem } from '@/services/cart.service'
import { useSaveFavorite } from '@/services/wishlist.service'
import { BASE_GRAMS, defaultGrams, formatGrams as label, gramsOptions, packPrice } from '@/utils/helper'
import type { ID } from '@/types/models'

interface AddToCartProps {
    productID: ID
    name: string
    price: number
    variants?: string | string[]
}

export default function AddToCart({ productID, name, price, variants }: AddToCartProps) {
    const PRESETS = gramsOptions(variants)
    const [grams, setGrams] = useState(() => defaultGrams(variants))
    const [stuck, setStuck] = useState(false)
    const anchor = useRef<HTMLDivElement>(null)

    // guest -> localStorage, logged in -> backend (see services/cart.service.ts)
    const { addItem, isPending: adding } = useAddItem()
    // guest -> login page, logged in -> backend (see services/wishlist.service.ts)
    const { saveFavorite, isPending: saving } = useSaveFavorite()

    const total = packPrice(price, grams)

    useEffect(() => {
        const el = anchor.current
        if (!el || !("IntersectionObserver" in window)) return
        const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 })
        io.observe(el)
        return () => io.disconnect()
    }, [])

    const set = (g: number) => setGrams(g)

    // One line = one pack of the chosen weight; the cart's own +/- changes how many packs.
    const add = () => addItem({ product: productID, grams, quantity: 1 })
    const addToFavorites = () => saveFavorite(productID)

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
            <button type="button" onClick={add} disabled={adding}
                className="btn-organic h-12 flex-1 border-transparent bg-brown px-8 text-sm font-medium !text-white disabled:cursor-wait disabled:opacity-70">
                Add {label(grams)} to cart · ${total}
            </button>
            <button type="button" onClick={addToFavorites} disabled={saving} aria-label="Add to favorites"
                className="btn-organic flex size-12 items-center justify-center bg-surface text-xl text-fg hover:!border-berry/50 hover:text-berry disabled:cursor-wait disabled:opacity-60"><MdFavoriteBorder /></button>
        </div>

        <div aria-hidden={!stuck} className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas/90 px-4 py-3 backdrop-blur-xl transition-transform duration-300 lg:hidden ${stuck ? "translate-y-0" : "translate-y-full"}`}>
            <div className="container flex items-center gap-4 !px-0">
                <div className="min-w-0 flex-1">
                    <p className="m-0 truncate text-sm font-medium text-fg">{name} · {label(grams)}</p>
                    <p className="m-0 font-display text-lg font-semibold text-fg">${total}</p>
                </div>
                <button type="button" tabIndex={stuck ? 0 : -1} onClick={add} disabled={adding}
                    className="btn-organic h-11 shrink-0 border-transparent bg-brown px-7 text-sm font-medium !text-white disabled:cursor-wait disabled:opacity-70">
                    Add to cart
                </button>
            </div>
        </div>
        </>
    )
}
