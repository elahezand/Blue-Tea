"use client"
import Link from "next/link";
import Image from 'next/image';
import type { ID } from '@/types/models';
import { MdFavoriteBorder } from 'react-icons/md';
interface ProductProps {
    id: ID
    name: string
    img: string | string[]
    shortDescription?: string
    score?: number
    price: number
}

export default function Product({ name, img, shortDescription, score, price, id }: ProductProps) {
    const cover = Array.isArray(img) ? img[0] : img
    const addToCart = () => {
        // TODO: add-to-cart request (removed for now), payload: { product: id, quantity: 1 }
    }

    const addToFavoriteList = () => {
        // TODO: add-to-favorites request (removed for now), payload: { productID: id }
    }
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
                    <span className="font-display text-lg font-semibold">${price}</span>
                    <span className="text-muted" aria-label={`Rated ${score} out of 5`}>★ {score}</span>
                </div>
            </div>
            <div className="mt-auto flex gap-2 pt-2.5">
                <button className={`${btn} border-transparent bg-brown text-white shadow-sm hover:-translate-y-0.5 hover:brightness-110 hover:shadow-md`} onClick={addToCart}>
                    Add to cart</button>
                <button className={`${btn} flex-none border-line bg-surface px-3 text-fg hover:border-berry/50 hover:bg-berry/10 hover:text-berry disabled:cursor-wait disabled:opacity-60`} onClick={addToFavoriteList} aria-label="Add to favorites">
                    <MdFavoriteBorder className="text-lg" /></button>
            </div>
        </div>
    );
}