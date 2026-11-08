"use client"
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { MdOutlineCancel, MdOutlineShoppingCart, MdAdd, MdRemove, MdArrowBack } from "react-icons/md"
import EmptyState from "@/components/modules/emptyState"
import Loader from "@/components/feedBack/Loader"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { shippingSchema, type ShippingInput } from "@/validators/order"
import { useGetMyCart, useRemoveFromCart, useUpdateCartItem } from "@/services/cart.service"
import { formatGrams, formatPrice } from "@/utils/helper"
import type { CartItem, Order } from "@/types/models"

export default function CartItems() {
    const { data: cart, isLoading } = useGetMyCart()
    const items = cart?.items ?? []

    const { mutate: updateItem, isPending: updating, variables: updatingVars } = useUpdateCartItem()
    const { mutate: removeItem, isPending: removing, variables: removingId } = useRemoveFromCart()

    const isBusy = (item: CartItem) =>
        (updating && updatingVars?.id === item._id) || (removing && removingId === item._id)

    const changeQuantity = (item: CartItem, quantity: number) => {
        if (quantity < 1) return
        updateItem({ id: item._id, payload: { quantity } })
    }

    const [paymentMethod, setPaymentMethod] = useState<Order["paymentMethod"]>("online")

    const totalShown = formatPrice(cart?.totalPrice ?? 0)
    const totalCount = cart?.totalCount ?? 0

    const { handleSubmit, control, formState: { errors } } = useForm<ShippingInput>({
        resolver: zodResolver(shippingSchema),
        defaultValues: {
            fullName: "",
            phone: "",
            address: "",
            city: "",
            postalCode: "",
        }
    })

    const submitOrder = (data: ShippingInput) => {
        if (!items.length) return toast.error("Cart is empty")
        const orderData = { paymentMethod, shippingAddress: data }
        void orderData
    }

    const labels: Record<keyof ShippingInput, string> = { fullName: "Full name", phone: "Phone", address: "Address", city: "City", postalCode: "Postal code" }

    if (isLoading) return <Loader inline label="Loading your cart" />

    if (!items.length) {
        return (
            <div className="container">
                <EmptyState icon={<MdOutlineShoppingCart />} title="Your cart is empty"
                    text="Add a tea, a brewer or a cup and it will show up here."
                    href="/products" action="Browse the store" />
            </div>
        )
    }

    return (
        <div className="container">
            <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                <div className="min-w-0">
                {/* Cart items */}
                <ul className="m-0 list-none divide-y divide-line rounded-2xl border border-solid border-line bg-surface p-2 ps-2">
                    {items.map((item) => {
                        const busy = isBusy(item)
                        return (
                        <li key={item._id} aria-busy={busy} className={`flex flex-wrap items-center gap-x-4 gap-y-3 p-3 transition-opacity sm:flex-nowrap ${busy ? "opacity-60" : ""}`}>
                            {item.product.img && <Image width={64} height={64} src={item.product.img} className="no-tint size-16 rounded-xl object-cover" alt={item.product.name || ""} />}
                            <div className="min-w-0 grow">
                                <Link href={`/products/${item.product._id}`} className="mb-0.5 block truncate text-base font-medium text-fg hover:text-link">{item.product.name}</Link>
                                <span className="text-sm text-muted">{formatGrams(item.grams)} · {formatPrice(item.unitPrice)} per pack</span>
                            </div>
                            <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-start">
                            <div className="flex items-center rounded-full border border-solid border-line">
                                <button type="button" aria-label="Decrease quantity" onClick={() => changeQuantity(item, item.quantity - 1)}
                                    disabled={busy || item.quantity <= 1}
                                    className="flex size-9 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-lg text-fg hover:bg-soft disabled:cursor-not-allowed disabled:opacity-40"><MdRemove /></button>
                                <span className="w-8 text-center text-sm font-medium text-fg" aria-live="polite">{item.quantity}</span>
                                <button type="button" aria-label="Increase quantity" onClick={() => changeQuantity(item, item.quantity + 1)}
                                    disabled={busy}
                                    className="flex size-9 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-lg text-fg hover:bg-soft disabled:cursor-not-allowed disabled:opacity-40"><MdAdd /></button>
                            </div>
                            <span className="w-16 text-end font-display text-lg font-semibold text-fg">{formatPrice(item.subtotal)}</span>
                            <button type="button" aria-label={`Remove ${item.product.name || "item"}`} onClick={() => removeItem(item._id)}
                                disabled={busy}
                                className="flex cursor-pointer border-none bg-transparent p-1 text-xl text-muted transition-colors hover:text-berry disabled:cursor-not-allowed"><MdOutlineCancel /></button>
                            </div>
                        </li>
                        )
                    })}
                </ul>

                {/* Quiet summary and a way back to the shop, so the column does not end after the last row */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-line bg-soft/60 px-5 py-4">
                    <Link href="/products" className="link-more inline-flex items-center gap-1.5"><MdArrowBack aria-hidden />Continue shopping</Link>
                    <p className="m-0 text-sm text-muted">
                        {totalCount} {totalCount === 1 ? "item" : "items"}
                        <span className="ms-4">Subtotal <span className="font-semibold text-fg">{totalShown}</span></span>
                    </p>
                </div>
                </div>

                {/* Shipping and payment */}
                <form onSubmit={handleSubmit(submitOrder)} noValidate className="rounded-2xl border border-solid border-line bg-surface p-6 lg:sticky lg:top-24">
                    <h2 className="mb-4 text-xl text-fg">Delivery details</h2>
                    {(Object.keys(labels) as (keyof ShippingInput)[]).map((field) => (
                        <Controller key={field} name={field} control={control}
                            render={({ field: c }) => (
                                <div className="mb-3">
                                    <label htmlFor={`ship-${field}`} className="field-label">{labels[field]}</label>
                                    <input {...c} id={`ship-${field}`} aria-invalid={!!errors[field]} className="field" />
                                    {errors[field] && <p className="auth-error" role="alert">{errors[field]?.message}</p>}
                                </div>
                            )} />
                    ))}
                    <label htmlFor="pay" className="field-label mt-2">Payment</label>
                    <select id="pay" className="field mb-5" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as Order["paymentMethod"])}>
                        <option value="online">Pay online</option>
                        <option value="cash">Pay with cash</option>
                    </select>
                    <div className="mb-4 flex items-baseline justify-between border-t border-line pt-4">
                        <span className="text-muted">Total</span>
                        <span className="font-display text-2xl font-semibold text-fg">{totalShown}</span>
                    </div>
                    <button type="submit" className="auth-btn disabled:cursor-wait disabled:opacity-60">
                        Place order
                    </button>
                </form>
            </div>
        </div>
    )
}