"use client"
import { useEffect, useId, useRef, useState } from 'react'
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md'
import { useAddItem } from '@/services/cart.service'
import { useSavedProductIds, useToggleFavorite } from '@/services/wishlist.service'
import { BASE_GRAMS, defaultGrams, formatGrams as label, formatPrice, gramsOptions, packPrice } from '@/utils/helper'
import type { ID } from "@/types/api"

interface AddToCartProps {
    productID: ID
    name: string
    price: number
    variants?: string | string[]
}

export default function AddToCart({ productID, name, price, variants }: AddToCartProps) {
    const presets = gramsOptions(variants)
    const weightGroup = useId()
    const [grams, setGrams] = useState(() => defaultGrams(variants))
    const [stuck, setStuck] = useState(false)
    const anchor = useRef<HTMLDivElement>(null)

    const { addItem, isPending: adding } = useAddItem()
    const { toggleFavorite, isPending: saving } = useToggleFavorite()
    const saved = useSavedProductIds().has(productID)

    const total = packPrice(price, grams)

    useEffect(() => {
        const el = anchor.current
        if (!el || !("IntersectionObserver" in window)) return
        const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 })
        io.observe(el)
        return () => io.disconnect()
    }, [])

    const add = () => addItem({ product: productID, grams, quantity: 1 })
    const addToFavorites = () => toggleFavorite(productID)

    return (
        <>
        <div className="rounded-2xl bg-soft/65 p-4 sm:p-5">
            <fieldset className="m-0 min-w-0 border-0 p-0">
                <legend className="mb-1 font-display text-xl font-medium text-fg">Choose a weight</legend>
                <p className="mb-3 text-sm text-muted">{formatPrice(price)} per {BASE_GRAMS} g</p>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                    {presets.map((g) => {
                        const on = grams === g
                        return (
                            <label key={g} className="cursor-pointer">
                                <input type="radio" name={weightGroup} value={g} checked={on} onChange={() => setGrams(g)} className="peer sr-only" />
                                <span className={`inline-flex min-h-11 min-w-16 items-center justify-center rounded-full border px-3 text-sm font-medium transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brown ${on ? "border-brown bg-brown text-white" : "border-line bg-surface text-fg hover:border-brown/55"}`}>
                                    {label(g)}
                                </span>
                            </label>
                        )
                    })}
                </div>
            </fieldset>

            <div ref={anchor} className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4 sm:gap-3">
                <div className="w-full sm:w-auto sm:flex-1" role="status" aria-atomic="true">
                    <p className="m-0 text-sm text-muted">Total for {label(grams)}</p>
                    <p className="m-0 font-display text-2xl font-semibold text-fg tabular-nums">{formatPrice(total)}</p>
                </div>
                <button type="button" onClick={add} disabled={adding}
                    className="btn btn-primary min-h-12 flex-1 disabled:cursor-wait sm:flex-none">
                    Add to cart
                </button>
                <button type="button" onClick={addToFavorites} disabled={saving} aria-pressed={saved}
                    aria-label={saved ? "Remove from favorites" : "Add to favorites"}
                    className={`btn btn-outline btn-icon size-12 shrink-0 text-xl hover:!border-berry/50 hover:text-berry disabled:cursor-wait ${saved ? "!border-berry/50 !bg-berry/10 !text-berry" : ""}`}>
                    {saved ? <MdFavorite aria-hidden /> : <MdFavoriteBorder aria-hidden />}
                </button>
            </div>
        </div>

        <div aria-hidden={!stuck} className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas/90 px-4 py-3 backdrop-blur-xl transition-transform duration-300 lg:hidden ${stuck ? "translate-y-0" : "translate-y-full"}`}>
            <div className="container flex items-center gap-4 !px-0">
                <div className="min-w-0 flex-1">
                    <p className="m-0 truncate text-sm font-medium text-fg">{name} · {label(grams)}</p>
                    <p className="m-0 font-display text-lg font-semibold text-fg">{formatPrice(total)}</p>
                </div>
                <button type="button" tabIndex={stuck ? 0 : -1} onClick={add} disabled={adding}
                    className="btn btn-primary shrink-0 disabled:cursor-wait">
                    Add to cart
                </button>
            </div>
        </div>
        </>
    )
}
