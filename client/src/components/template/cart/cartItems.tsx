"use client"
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MdOutlineCancel, MdOutlineShoppingCart, MdAdd, MdRemove, MdArrowBack } from "react-icons/md"
import EmptyState from "@/components/modules/emptyState"
import Loader from "@/components/feedback/loader"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { checkoutSchema, type CheckoutInput } from "@/validators/order"
import { useAddToCart, useApplyDiscount, useClearCart, useGetMyCart, useRemoveFromCart } from "@/services/cart.service"
import { useCreateOrder } from "@/services/order.service"
import { applyFieldErrors } from "@/utils/apiError"
import { ROUTES } from "@/utils/constant"
import { formatGrams, formatPrice } from "@/utils/helper"
import type { CartItem } from "@/types/cart"

export default function CartItems() {
    const { data: cart, isLoading } = useGetMyCart()
    const items = cart?.items ?? []

    const { mutate: addItem, isPending: changing, variables: changingVars } = useAddToCart({ notify: false })
    const { mutate: removeItem, isPending: removing, variables: removingId } = useRemoveFromCart()
    const { mutate: clearCart, isPending: clearing } = useClearCart()

    const [code, setCode] = useState("")
    const { mutate: applyDiscount, isPending: applying } = useApplyDiscount(() => setCode(""))

    const isBusy = (item: CartItem) => clearing ||
        (changing && changingVars?.product === item.product._id && changingVars?.grams === item.grams) ||
        (removing && removingId === item._id)

    const changeQuantity = (item: CartItem, by: 1 | -1) => {
        if (item.quantity + by < 1) return
        addItem({ product: item.product._id, grams: item.grams, quantity: by })
    }

    const totalShown = formatPrice(cart?.totalPrice ?? 0)
    const discount = cart?.discount ?? 0
    const payShown = formatPrice(cart?.finalPrice ?? (cart?.totalPrice ?? 0) - discount)
    const totalCount = cart?.totalCount ?? 0

    const router = useRouter()
    const { mutate: createOrder, isPending: ordering } = useCreateOrder((order) => router.push(`${ROUTES.PAYMENT_RESULT}?orderId=${order._id}`))

    const { register, handleSubmit, setError, formState: { errors } } = useForm<CheckoutInput>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: { fullName: "", phone: "", address: "", city: "", postalCode: "", paymentMethod: "online" },
    })

    const submitOrder = ({ paymentMethod, ...shippingAddress }: CheckoutInput) =>
        createOrder({ paymentMethod, shippingAddress }, { onError: (error) => applyFieldErrors(error, setError) })

    const labels: Record<Exclude<keyof CheckoutInput, "paymentMethod">, string> = { fullName: "Full name", phone: "Phone", address: "Address", city: "City", postalCode: "Postal code" }

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
                                <button type="button" aria-label="Decrease quantity" onClick={() => changeQuantity(item, -1)}
                                    disabled={busy || item.quantity <= 1}
                                    className="flex size-9 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-lg text-fg hover:bg-soft disabled:cursor-not-allowed disabled:opacity-40"><MdRemove /></button>
                                <span className="w-8 text-center text-sm font-medium text-fg" aria-live="polite">{item.quantity}</span>
                                <button type="button" aria-label="Increase quantity" onClick={() => changeQuantity(item, 1)}
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

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-line bg-soft/60 px-5 py-4">
                    <Link href="/products" className="link-more inline-flex items-center gap-1.5"><MdArrowBack aria-hidden />Continue shopping</Link>
                    <p className="m-0 text-sm text-muted">
                        {totalCount} {totalCount === 1 ? "item" : "items"}
                        <span className="ms-4">Subtotal <span className="font-semibold text-fg">{totalShown}</span></span>
                    </p>
                    <button type="button" onClick={() => clearCart()} disabled={clearing}
                        className="cursor-pointer border-none bg-transparent p-0 text-sm text-muted underline-offset-4 hover:text-berry hover:underline disabled:cursor-wait">
                        {clearing ? "Emptying..." : "Empty cart"}
                    </button>
                </div>

                <div className="mt-4 rounded-2xl border border-solid border-line bg-surface px-5 py-4">
                    {cart?.discountCode ? (
                        <p className="m-0 text-sm text-muted">Code <span className="font-semibold text-fg">{cart.discountCode}</span> is on: {formatPrice(discount)} off</p>
                    ) : (
                        <div className="flex flex-wrap items-end gap-2">
                            <div className="min-w-40 flex-1">
                                <label htmlFor="discount-code" className="field-label !mb-1 text-xs">Discount code</label>
                                <input id="discount-code" value={code} onChange={(e) => setCode(e.target.value)} maxLength={30} autoComplete="off"
                                    onKeyDown={(e) => { if (e.key === "Enter" && code.trim()) applyDiscount({ code: code.trim() }) }}
                                    className="field field-sm !rounded-full !px-4 !py-2 uppercase" />
                            </div>
                            <button type="button" onClick={() => applyDiscount({ code: code.trim() })} disabled={!code.trim() || applying}
                                className="classic !px-5 !py-2 disabled:cursor-not-allowed disabled:opacity-60">
                                {applying ? "Checking..." : "Apply"}
                            </button>
                        </div>
                    )}
                </div>
                </div>

                <form onSubmit={handleSubmit(submitOrder)} noValidate className="rounded-2xl border border-solid border-line bg-surface p-6 lg:sticky lg:top-24">
                    <h2 className="mb-4 text-xl text-fg">Delivery details</h2>
                    {(Object.keys(labels) as (keyof typeof labels)[]).map((field) => (
                        <div key={field} className="mb-3">
                            <label htmlFor={`ship-${field}`} className="field-label">{labels[field]}</label>
                            <input {...register(field)} id={`ship-${field}`} aria-invalid={!!errors[field]} className="field" />
                            {errors[field] && <p className="auth-error" role="alert">{errors[field]?.message}</p>}
                        </div>
                    ))}
                    <label htmlFor="pay" className="field-label mt-2">Payment</label>
                    <select id="pay" {...register("paymentMethod")} className="field mb-5">
                        <option value="online">Pay online</option>
                        <option value="cash">Pay with cash</option>
                    </select>
                    {discount > 0 && (
                        <div className="flex items-baseline justify-between border-t border-line pt-4 text-sm text-muted">
                            <span>Discount{cart?.discountCode ? ` (${cart.discountCode})` : ""}</span>
                            <span>−{formatPrice(discount)}</span>
                        </div>
                    )}
                    <div className={`mb-4 flex items-baseline justify-between pt-4 ${discount > 0 ? "" : "border-t border-line"}`}>
                        <span className="text-muted">Total</span>
                        <span className="font-display text-2xl font-semibold text-fg">{payShown}</span>
                    </div>
                    <button type="submit" disabled={ordering} className="auth-btn disabled:cursor-wait disabled:opacity-60">
                        {ordering ? "Placing your order..." : "Place order"}
                    </button>
                </form>
            </div>
        </div>
    )
}