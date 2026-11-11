"use client"
import Link from "next/link"
import swal from "@/components/modules/swal"
import Badge from "@/components/modules/badge"
import Loader from "@/components/feedback/loader"
import OrderTimeline from "@/components/modules/order/orderTimeline"
import { useCancelMyOrder, useConfirmDelivery, useGetMyOrder } from "@/services/order.service"
import { formatPrice } from "@/utils/helper"
import type { ID } from "@/types/api"

export default function OrderDetail({ id }: { id: ID }) {
    const { data: order, isLoading, isError } = useGetMyOrder(id)
    const { mutate: cancel, isPending: canceling } = useCancelMyOrder()
    const { mutate: confirmDelivery, isPending: confirming } = useConfirmDelivery()

    if (isLoading) return <Loader inline label="Loading your order" />
    if (isError || !order) return <p className="rounded-2xl bg-soft/70 px-5 py-10 text-center text-muted">This order was not found.</p>

    const canCancel = !order.canceledAt && !order.shippedAt
    const canConfirm = !!order.shippedAt && !order.deliveredAt && !order.canceledAt

    const confirmCancel = () => swal({ title: "Cancel this order?", icon: "warning", buttons: ["No", "Yes, cancel"] })
        .then((ok) => { if (ok) cancel({ id: order._id }) })

    return (
        <div className="flex flex-col gap-6">
            <Link href="/account/orders" className="link-more">Back to orders</Link>
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-dashed border-line bg-surface p-5">
                <div>
                    <h2 className="m-0 mb-1 text-xl text-[var(--head)]">Order #{String(order._id).slice(-6).toUpperCase()}</h2>
                    <p className="m-0 text-sm text-muted">{formatPrice(order.totalPrice)} · <span className="capitalize">{order.paymentMethod}</span></p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Badge value={order.status} />
                    {canConfirm && <button type="button" disabled={confirming} onClick={() => confirmDelivery({ id: order._id })} className="classic !h-9">I received it</button>}
                    {canCancel && <button type="button" disabled={canceling} onClick={confirmCancel} className="btn-ghost !h-9 !text-berry">Cancel order</button>}
                </div>
            </div>

            <div className="rounded-3xl border border-solid border-line bg-surface p-5">
                <OrderTimeline order={order} />
            </div>

            <ul className="m-0 list-none divide-y divide-[var(--line)] rounded-3xl border border-solid border-line bg-surface p-0">
                {order.items.map((item, i) => (
                    <li key={item._id || i} className={`flex items-center justify-between gap-3 px-5 py-3 ${item.isCanceled ? "opacity-50" : ""}`}>
                        <span className={`text-fg ${item.isCanceled ? "line-through" : ""}`}>{item.title || "Item"} <span className="text-sm text-muted">× {item.quantity}</span></span>
                        <span className="text-fg">{item.isCanceled ? <Badge value="Canceled" /> : formatPrice(item.price * item.quantity)}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
