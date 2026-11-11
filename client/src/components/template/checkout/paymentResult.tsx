"use client"
import { useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { MdCheckCircleOutline, MdErrorOutline, MdHourglassEmpty } from "react-icons/md"
import Loader from "@/components/feedback/loader"
import OrderTimeline from "@/components/modules/order/orderTimeline"
import { CART_KEY } from "@/services/cart.service"
import { useGetMyOrder } from "@/services/order.service"
import { formatPrice } from "@/utils/helper"
import { ROUTES } from "@/utils/constant"

export default function PaymentResult() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get("orderId")
    const failed = searchParams.get("status") === "failed"
    const queryClient = useQueryClient()
    const { data: order, isLoading, isError } = useGetMyOrder(orderId)

    const done = !!order && !failed && (order.isPaid || order.paymentMethod === "cash")
    const waiting = !!order && !failed && !done

    useEffect(() => {
        if (done) {
            queryClient.invalidateQueries({ queryKey: CART_KEY })
            queryClient.invalidateQueries({ queryKey: ["orders"] })
        }
    }, [done, queryClient])

    if (!orderId) {
        return (
            <div className="rounded-3xl border-2 border-dashed border-line bg-surface p-8 text-center">
                <p className="m-0 text-muted">There is no order to show here.</p>
                <Link href={ROUTES.CART} className="link-more mt-4 inline-block">Back to your cart</Link>
            </div>
        )
    }

    if (isLoading) return <Loader inline label="Checking your payment" />

    if (isError || !order || failed) {
        return (
            <div className="rounded-3xl border-2 border-dashed border-berry/40 bg-berry/[0.05] p-8 text-center">
                <MdErrorOutline aria-hidden className="mx-auto mb-3 text-5xl text-berry" />
                <h2 className="mb-2 text-2xl text-fg">The payment did not go through</h2>
                <p className="mx-auto mb-6 max-w-md text-muted">No money was taken. Your items are still in your cart, so you can try again.</p>
                <div className="flex flex-wrap justify-center gap-3">
                    <Link href={ROUTES.CART} className="classic">Back to your cart</Link>
                    <Link href="/account/tickets/new" className="btn-ghost">Ask for help</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <div className={`rounded-3xl border-2 border-dashed p-8 text-center ${done ? "border-[var(--green)]/50 bg-[var(--green)]/[0.06]" : "border-line bg-surface"}`}>
                {done
                    ? <MdCheckCircleOutline aria-hidden className="mx-auto mb-3 text-5xl text-[var(--green)]" />
                    : <MdHourglassEmpty aria-hidden className="mx-auto mb-3 text-5xl text-muted" />}
                <h2 className="mb-2 text-2xl text-fg">{done ? "Thank you, your order is placed" : "We are checking your payment"}</h2>
                <p className="mx-auto mb-1 max-w-md text-muted">
                    Order #{String(order._id).slice(-6).toUpperCase()} · {formatPrice(order.totalPrice)} · <span className="capitalize">{order.paymentMethod}</span>
                </p>
                {waiting && <p className="mx-auto max-w-md text-sm text-muted">This can take a few minutes. You will see the result on your order page.</p>}
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Link href={`/account/orders/${order._id}`} className="classic">See your order</Link>
                    <Link href="/products" className="btn-ghost">Keep shopping</Link>
                </div>
            </div>
            <div className="rounded-3xl border border-solid border-line bg-surface p-5">
                <OrderTimeline order={order} />
            </div>
        </div>
    )
}
