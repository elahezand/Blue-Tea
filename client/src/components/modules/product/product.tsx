"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { MdFavorite, MdFavoriteBorder } from "react-icons/md"
import { useAddItem } from "@/services/cart.service"
import { useToggleFavorite } from "@/services/wishlist.service"
import { defaultGrams, firstImage, formatGrams, formatPrice } from "@/utils/helper"
import type { ID } from "@/types/api"

interface ProductProps {
    id: ID
    name: string
    img: string
    shortDescription?: string
    score?: number
    price: number
    variants?: string | string[]
    saved?: boolean
}

export default function Product({ name, img, shortDescription, score, price, id, variants, saved = false }: ProductProps) {
    const cover = firstImage(img)
    const grams = defaultGrams(variants)
    const [pendingSaved, setPendingSaved] = useState<boolean | null>(null)
    const shownSaved = pendingSaved ?? saved

    useEffect(() => {
        setPendingSaved(null)
    }, [saved])

    const { addItem, isPending: adding } = useAddItem()
    const { toggleFavoriteAsync, isPending: saving, isLoggedIn } = useToggleFavorite()

    const btn = "flex-1 cursor-pointer whitespace-nowrap rounded-full border border-solid px-2 py-1.5 text-center text-[13px] font-medium transition duration-200 active:scale-95"

    const onFavorite = async () => {
        if (!isLoggedIn) {
            toggleFavoriteAsync(id)
            return
        }
        const next = !shownSaved
        setPendingSaved(next)
        try {
            await toggleFavoriteAsync(id)
        } catch {
            setPendingSaved(null)
        }
    }

    return (
        <div className="product-card group flex h-full w-full flex-col rounded-2xl border border-solid border-line bg-surface p-2.5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[var(--lamp)]">
            <Link href={`/products/${id}`} className="photo block aspect-square">
                <Image width={320} height={320} src={cover} alt={name || ""}
                    className="no-tint h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            </Link>
            <div className="mt-2.5 text-fg">
                <h3 className="mb-0 truncate text-[15px] font-medium">{name}</h3>
                {shortDescription && <p className="mb-2 line-clamp-1 text-sm leading-5 text-muted">{shortDescription}</p>}
                <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="price-tag">
                        <span className="font-display text-base font-semibold">{formatPrice(price)}</span>
                        <span className="text-xs text-muted">/100 g</span>
                    </span>
                    {score ? <span className="text-muted" aria-label={`Rated ${score} out of 5`}><span className="text-[var(--lamp)]">★</span> {score}</span> : null}
                </div>
            </div>
            <div className="mt-auto flex gap-2 pt-3">
                <button type="button" disabled={adding} onClick={() => addItem({ product: id, grams, quantity: 1 })} aria-label={`Add ${formatGrams(grams)} of ${name} to cart`}
                    className={`${btn} border-transparent bg-brown text-white shadow-sm hover:-translate-y-0.5 hover:brightness-110 hover:shadow-md disabled:cursor-wait disabled:opacity-70`}>
                    Add {formatGrams(grams)}
                </button>
                <button type="button" disabled={saving} onClick={onFavorite} aria-pressed={shownSaved}
                    aria-label={shownSaved ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
                    className={`${btn} flex-none px-3 disabled:cursor-wait disabled:opacity-60 ${shownSaved ? "border-berry/50 bg-berry/10 text-berry" : "border-line bg-surface text-fg hover:border-berry/50 hover:bg-berry/10 hover:text-berry"}`}>
                    {shownSaved ? <MdFavorite className="text-lg" /> : <MdFavoriteBorder className="text-lg" />}
                </button>
            </div>
        </div>
    )
}