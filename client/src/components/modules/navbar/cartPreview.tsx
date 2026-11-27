"use client"

import { useEffect, useId, useRef, useState } from "react"
import Link from "next/link"
import { MdClose, MdOutlineShoppingCart } from "react-icons/md"
import { useAuth } from "@/hooks/useAuth"
import { useGet } from "@/hooks/useApi"
import { useGetMyCart } from "@/services/cart.service"
import type { ApiResponse } from "@/types/api"
import type { GuestCartItem } from "@/types/cart"
import type { Product } from "@/types/product"
import { ENDPOINTS } from "@/utils/constant"
import { useGuestCartItems } from "@/utils/guestCart"
import { formatGrams, formatPrice, isValidObjectId, packPrice } from "@/utils/helper"

function CartRow({ name, grams, quantity, subtotal }: {
    name: string; grams: number; quantity: number; subtotal?: number
}) {
    return (
        <li className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0">
                <p className="m-0 break-words font-medium">{name}</p>
                <p className="m-0 text-sm text-muted">{formatGrams(grams)} × {quantity}</p>
            </div>
            {subtotal !== undefined && <span className="shrink-0 text-sm tabular-nums">{formatPrice(subtotal)}</span>}
        </li>
    )
}

function GuestRow({ item }: { item: GuestCartItem }) {
    const { data, isLoading } = useGet<ApiResponse<Product>>(`${ENDPOINTS.PRODUCTS}/${item.product}`, {}, {
        enabled: isValidObjectId(item.product),
        silent: true,
    })
    const product = data?.data
    return <CartRow name={product?.name ?? (isLoading ? "Loading product…" : "Product unavailable")}
        grams={item.grams} quantity={item.quantity}
        subtotal={product ? packPrice(product.price, item.grams) * item.quantity : undefined} />
}

export default function CartPreview({ onOpen }: { onOpen: () => void }) {
    const [open, setOpen] = useState(false)
    const panelId = useId()
    const drawer = useRef<HTMLDialogElement>(null)
    const { isLoggedIn } = useAuth()
    const { data: cart, isPending, isError, refetch } = useGetMyCart()
    const guestItems = useGuestCartItems()
    const count = isLoggedIn ? cart?.totalCount ?? 0 : guestItems.reduce((total, item) => total + item.quantity, 0)

    useEffect(() => {
        const dialog = drawer.current
        if (!dialog) return
        if (open && !dialog.open) dialog.showModal()
        else if (!open && dialog.open) dialog.close()
    }, [open])

    useEffect(() => {
        if (!open) return
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"
        return () => { document.body.style.overflow = previousOverflow }
    }, [open])

    const items = isLoggedIn ? cart?.items ?? [] : guestItems
    return (
        <div>
            <button type="button" aria-label={count ? `Cart, ${count} items` : "Cart"}
                aria-haspopup="dialog" aria-expanded={open} aria-controls={panelId}
                onClick={() => {
                    if (!open) onOpen()
                    setOpen(!open)
                }}
                className="relative flex size-10 cursor-pointer items-center justify-center rounded-full text-[var(--cream)] hover:bg-white/10">
                <MdOutlineShoppingCart size={22} aria-hidden />
                {count > 0 && (
                    <span aria-hidden className="absolute -top-1 -right-1 min-w-4.5 rounded-full bg-[var(--cream)] px-1 text-center text-[11px] leading-[18px] font-semibold text-[var(--navy)]">{count}</span>
                )}
            </button>
            <dialog ref={drawer} id={panelId} aria-labelledby={`${panelId}-title`}
                onClose={() => setOpen(false)}
                onClick={event => { if (event.target === event.currentTarget) setOpen(false) }}
                className="cart-drawer fixed inset-y-0 right-auto left-0 m-0 h-dvh max-h-none w-full max-w-sm border-0 bg-surface p-0 text-fg shadow-2xl backdrop:bg-black/50">
                <div className="flex h-full min-h-0 flex-col">
                    <div className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-5 py-4">
                        <h2 id={`${panelId}-title`} className="m-0 text-xl">Your cart</h2>
                        <button type="button" aria-label="Close cart" onClick={() => setOpen(false)}
                            className="grid size-11 cursor-pointer place-items-center rounded-full hover:bg-soft">
                            <MdClose size={22} aria-hidden />
                        </button>
                    </div>
                    {open && (
                        <>
                            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5">
                                {isLoggedIn && isPending && <p role="status" className="my-4 text-sm text-muted">Loading your cart…</p>}
                                {isLoggedIn && isError && (
                                    <p role="alert" className="my-4 text-sm">Couldn&apos;t load your cart.{" "}
                                        <button type="button" className="cursor-pointer text-link underline" onClick={() => void refetch()}>Retry</button>
                                    </p>
                                )}
                                {items.length > 0 ? (
                                    <ul className="my-3 list-none divide-y divide-line p-0">
                                        {isLoggedIn
                                            ? cart?.items.map(item => <CartRow key={item._id} name={item.product.name} grams={item.grams}
                                                quantity={item.quantity} subtotal={item.subtotal} />)
                                            : guestItems.map((item, index) => <GuestRow key={`${item.product}:${item.grams}:${index}`} item={item} />)}
                                    </ul>
                                ) : (!isLoggedIn || (!isPending && !isError)) && <p className="my-4 text-sm text-muted">Your cart is empty.</p>}
                            </div>
                            <div className="shrink-0 border-t border-line px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                                {isLoggedIn && cart && cart.items.length > 0 && (
                                    <p className="mt-0 mb-3 flex justify-between text-sm font-semibold">
                                        <span>Total</span><span>{formatPrice(cart.finalPrice ?? cart.totalPrice)}</span>
                                    </p>
                                )}
                                <Link href="/cart" onClick={() => setOpen(false)} className="btn btn-primary w-full">View cart</Link>
                            </div>
                        </>
                    )}
                </div>
            </dialog>
        </div>
    )
}
