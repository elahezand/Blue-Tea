"use client"
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

    const { addItem, isPending: adding } = useAddItem()
    const { toggleFavorite, isPending: saving } = useToggleFavorite()

    return (
        <div className="product-card group flex h-full w-full min-w-0 flex-col rounded-2xl bg-surface p-2.5 shadow-sm shadow-[var(--lamp)]/30 ring-1 ring-line/45 transition-shadow duration-300 sm:p-3">
            <Link href={`/products/${id}`} className="photo block aspect-square" aria-label={name}>
                <Image width={320} height={320} src={cover} alt={name || ""}
                    className="no-tint h-full w-full object-cover transition duration-500 motion-safe:group-hover:scale-105" />
            </Link>
            <div className="mt-3 text-fg">
                <h3 className="mb-1 line-clamp-2 min-h-10 font-body text-sm leading-5 font-semibold sm:text-base">{name}</h3>
                {shortDescription && <p className="mb-3 line-clamp-2 text-sm leading-5 text-muted">{shortDescription}</p>}
            </div>
            <div className="mt-auto pt-1">
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-sm">
                    <span className="price-tag">
                        <span className="font-display text-base font-semibold">{formatPrice(price)}</span>
                        <span className="text-xs text-muted">/100 g</span>
                    </span>
                    {score ? <span className="text-muted" aria-label={`Rated ${score} out of 5`}><span className="text-[var(--lamp)]">★</span> {score}</span> : null}
                </div>
                <div className="flex gap-1.5 pt-3 sm:gap-2">
                    <button type="button" disabled={adding} onClick={() => addItem({ product: id, grams, quantity: 1 })} aria-label={`Add ${formatGrams(grams)} of ${name} to cart`}
                        className="btn btn-primary min-w-0 flex-1 !px-1.5 !text-xs disabled:cursor-wait sm:!text-sm">
                        Add {formatGrams(grams)}
                    </button>
                    <button type="button" disabled={saving} onClick={() => toggleFavorite(id)} aria-pressed={saved}
                        aria-label={saved ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
                        className={`btn btn-outline btn-icon shrink-0 disabled:cursor-wait ${saved ? "!border-berry/50 !bg-berry/10 !text-berry" : ""}`}>
                        {saved ? <MdFavorite aria-hidden className="text-lg" /> : <MdFavoriteBorder aria-hidden className="text-lg" />}
                    </button>
                </div>
            </div>
        </div>
    )
}
