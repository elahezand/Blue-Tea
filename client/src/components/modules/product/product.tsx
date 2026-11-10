"use client"
import Link from "next/link";
import Image from 'next/image';
import type { ID } from '@/types/models';
import { MdFavoriteBorder } from 'react-icons/md';
import { useAddItem } from '@/services/cart.service';
import { useSaveFavorite } from '@/services/wishlist.service';
import { defaultGrams, formatGrams } from '@/utils/helper';
interface ProductProps {
    id: ID
    name: string
    img: string | string[]
    shortDescription?: string
    score?: number
    price: number
    /** weights the product is sold in ("100g, 250g"); the card adds one pack of the default weight */
    variants?: string | string[]
}

export default function Product({ name, img, shortDescription, score, price, id, variants }: ProductProps) {
    const cover = Array.isArray(img) ? img[0] : img
    const grams = defaultGrams(variants)

    // same hooks as the product page: guest -> localStorage / login, logged in -> backend
    const { addItem, isPending: adding } = useAddItem()
    const { saveFavorite, isPending: saving } = useSaveFavorite()

    const addToCart = () => addItem({ product: id, grams, quantity: 1 })
    const addToFavoriteList = () => saveFavorite(id)
    const btn = "flex-1 cursor-pointer whitespace-nowrap rounded-full border border-solid px-2 py-1.5 text-center text-[13px] font-medium transition duration-200 active:scale-95"

    return (
        <div className="group flex h-full w-full flex-col rounded-2xl border border-solid border-line bg-surface p-2.5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-brown/40 hover:shadow-lg">
            <Link href={`/products/${id}`} className="photo block aspect-square">
                <Image
                    width={320}
                    height={320}
                    className="no-tint h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    src={cover} alt={name || ""} />
            </Link>
            <div className="mt-2.5 text-fg">
                <h3 className="mb-0.5 truncate text-[15px] font-medium">{name}</h3>
                <p className="mb-1.5 line-clamp-1 text-[13px] leading-5 text-muted">{shortDescription}</p>
                <div className="flex items-center justify-between text-sm">
                    <span className="font-display text-lg font-semibold">${price}<span className="ms-0.5 text-xs font-normal text-muted">/100 g</span></span>
                    {score ? <span className="text-muted" aria-label={`Rated ${score} out of 5`}>★ {score}</span> : null}
                </div>
            </div>
            <div className="mt-auto flex gap-2 pt-2.5">
                <button type="button" disabled={adding} aria-label={`Add ${formatGrams(grams)} of ${name} to cart`}
                    className={`${btn} border-transparent bg-brown text-white shadow-sm hover:-translate-y-0.5 hover:brightness-110 hover:shadow-md disabled:cursor-wait disabled:opacity-70`} onClick={addToCart}>
                    Add {formatGrams(grams)}</button>
                <button type="button" disabled={saving} className={`${btn} flex-none border-line bg-surface px-3 text-fg hover:border-berry/50 hover:bg-berry/10 hover:text-berry disabled:cursor-wait disabled:opacity-60`} onClick={addToFavoriteList} aria-label="Add to favorites">
                    <MdFavoriteBorder className="text-lg" /></button>
            </div>
        </div>
    );
}