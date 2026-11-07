"use client"
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { MdOutlineCancel, MdOutlineShoppingCart, MdAdd, MdRemove, MdArrowBack } from "react-icons/md"
import EmptyState from "@/components/modules/emptyState"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { shippingSchema, type ShippingInput } from "@/validators/order"
import type { CartItem, ID, Order } from "@/types/models"

export default function CartItems({ userId }: { userId?: ID }) {
    // TODO: cart request (removed for now): the cart comes from the backend
    const cart: CartItem[] = []
    const increaseCount = (id: CartItem["id"]) => {
        // TODO: +1 request (removed for now)
        void id
    }
    const decreaseCount = (id: CartItem["id"]) => {
        // TODO: -1 request (removed for now)
        void id
    }
    const removeFromCart = (id: CartItem["id"]) => {
        // TODO: remove-item request (removed for now)
        void id
    }

    const [paymentMethod, setPaymentMethod] = useState<Order["paymentMethod"]>("online")

    const total = cart.reduce((acc, item) => acc + item.price * item.count, 0)
    const totalShown = Math.round(total * 100) / 100

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
        if (!cart.length) return toast.error("Cart is empty")
        const orderData = {
            user: userId,
            items: cart,
            totalPrice: total,
            paymentMethod,
            shippingAddress: data
        }
        // TODO: place-order request (removed for now), payload: orderData. On success: toast + reload the cart
        void orderData
    }

    const labels: Record<keyof ShippingInput, string> = { fullName: "Full name", phone: "Phone", address: "Address", city: "City", postalCode: "Postal code" }

    if (!cart.length) {
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
                    {cart.map((p) => (
                        <li key={p.id} className="flex flex-wrap items-center gap-x-4 gap-y-3 p-3 sm:flex-nowrap">
                            <Image width={64} height={64} src={p.img} priority className="no-tint size-16 rounded-xl object-cover" alt={p.title || ""} />
                            <div className="min-w-0 grow">
                                <h3 className="mb-0.5 truncate text-base font-medium text-fg">{p.title}</h3>
                                <span className="text-sm text-muted">${p.price} per pack</span>
                            </div>
                            <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-start">
                            <div className="flex items-center rounded-full border border-solid border-line">
                                <button type="button" aria-label="Decrease quantity" onClick={() => decreaseCount(p.id)}
                                    className="flex size-9 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-lg text-fg hover:bg-soft"><MdRemove /></button>
                                <span className="w-8 text-center text-sm font-medium text-fg" aria-live="polite">{p.count}</span>
                                <button type="button" aria-label="Increase quantity" onClick={() => increaseCount(p.id)}
                                    className="flex size-9 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-lg text-fg hover:bg-soft"><MdAdd /></button>
                            </div>
                            <span className="w-16 text-end font-display text-lg font-semibold text-fg">${Math.round(p.price * p.count * 100) / 100}</span>
                            <button type="button" aria-label={`Remove ${p.title || "item"}`} onClick={() => removeFromCart(p.id)}
                                className="flex cursor-pointer border-none bg-transparent p-1 text-xl text-muted transition-colors hover:text-berry"><MdOutlineCancel /></button>
                            </div>
                        </li>
                    ))}
                </ul>

                {/* Quiet summary and a way back to the shop, so the column does not end after the last row */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-line bg-soft/60 px-5 py-4">
                    <Link href="/products" className="link-more inline-flex items-center gap-1.5"><MdArrowBack aria-hidden />Continue shopping</Link>
                    <p className="m-0 text-sm text-muted">
                        {cart.reduce((n, i) => n + i.count, 0)} {cart.reduce((n, i) => n + i.count, 0) === 1 ? "item" : "items"}
                        <span className="ms-4">Subtotal <span className="font-semibold text-fg">${totalShown}</span></span>
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
                        <span className="font-display text-2xl font-semibold text-fg">${totalShown}</span>
                    </div>
                    <button type="submit" className="auth-btn disabled:cursor-wait disabled:opacity-60">
                        Place order
                    </button>
                </form>
            </div>
        </div>
    )
}