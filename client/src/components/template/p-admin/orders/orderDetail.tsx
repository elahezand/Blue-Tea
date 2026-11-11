"use client"
import Link from "next/link"
import swal from "@/components/modules/swal"
import Badge from "@/components/modules/badge"
import Loader from "@/components/feedback/loader"
import OrderTimeline from "@/components/modules/order/orderTimeline"
import { actDanger, actPrimary } from "@/components/modules/p-admin/cells"
import { useCancelOrder, useCancelOrderItem, useGetAdminOrder, useShipOrder } from "@/services/order.service"
import { formatPrice } from "@/utils/helper"
import type { ID } from "@/types/api"

export default function OrderDetail({ id }: { id: ID }) {
    const { data: order, isLoading, isError } = useGetAdminOrder(id)
    const { mutate: ship, isPending: shipping } = useShipOrder()
    const { mutate: cancel, isPending: canceling } = useCancelOrder()
    const { mutate: cancelItem, isPending: cancelingItem, variables: cancelVars } = useCancelOrderItem()

    if (isLoading) return <Loader inline label="Loading the order" />
    if (isError || !order) return <p className="rounded-2xl bg-soft/70 px-5 py-10 text-center text-muted">This order was not found.</p>

    const open = !order.canceledAt && !order.deliveredAt
    const canShip = open && !order.shippedAt && (order.isPaid || order.paymentMethod === "cash")
    const address = order.shippingAddress

    const confirmCancel = () => swal({ title: "Cancel this whole order?", icon: "warning", buttons: ["No", "Yes, cancel"] })
        .then((ok) => { if (ok) cancel({ id: order._id }) })
    const confirmCancelItem = (item: ID) => swal({ title: "Cancel this item?", icon: "warning", buttons: ["No", "Yes"] })
        .then((ok) => { if (ok) cancelItem({ id: order._id, payload: { item } }) })

    return (
        <div className="flex flex-col gap-6">
            <Link href="/p-admin/orders" className="link-more">Back to orders</Link>
            <div className="admin-card flex flex-wrap items-start justify-between gap-4 p-5">
                <div>
                    <h2 className="m-0 mb-1 text-xl font-semibold text-[var(--head)]">Order #{String(order._id).slice(-6).toUpperCase()}</h2>
                    <p className="m-0 text-sm text-muted">{order.user?.name || "Unknown"}{order.user?.email ? ` · ${order.user.email}` : ""}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Badge value={order.status} />
                    <Badge value={order.isPaid ? "Paid" : "Unpaid"} />
                    {canShip && <button type="button" disabled={shipping} onClick={() => ship({ id: order._id })} className={actPrimary}>Mark as shipped</button>}
                    {open && !order.shippedAt && <button type="button" disabled={canceling} onClick={confirmCancel} className={actDanger}>Cancel order</button>}
                </div>
            </div>

            <div className="admin-card p-5">
                <OrderTimeline order={order} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="admin-card p-5">
                    <h3 className="mb-3 text-lg font-semibold text-[var(--head)]">Items</h3>
                    <ul className="m-0 list-none divide-y divide-[var(--line)] p-0">
                        {order.items.map((item, i) => (
                            <li key={item._id || i} className={`flex items-center justify-between gap-3 py-3 ${item.isCanceled ? "opacity-50" : ""}`}>
                                <span className="min-w-0">
                                    <span className={`block truncate font-medium text-fg ${item.isCanceled ? "line-through" : ""}`}>{item.title || "Item"}</span>
                                    <span className="text-xs text-muted">{item.quantity} × {formatPrice(item.price)}</span>
                                </span>
                                {item.isCanceled ? <Badge value="Canceled" /> : open && !order.shippedAt && item._id && (
                                    <button type="button" disabled={cancelingItem && cancelVars?.payload?.item === item._id} onClick={() => confirmCancelItem(item._id as ID)} className={actDanger}>Cancel item</button>
                                )}
                            </li>
                        ))}
                    </ul>
                    <p className="m-0 mt-3 flex justify-between border-t border-line pt-3 font-medium text-fg"><span>Total</span><span>{formatPrice(order.totalPrice)}</span></p>
                </div>
                <div className="admin-card p-5">
                    <h3 className="mb-3 text-lg font-semibold text-[var(--head)]">Delivery</h3>
                    {address ? (
                        <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                            <dt className="text-muted">Name</dt><dd className="m-0 text-fg">{address.fullName}</dd>
                            <dt className="text-muted">Phone</dt><dd className="m-0 text-fg">{address.phone}</dd>
                            <dt className="text-muted">City</dt><dd className="m-0 text-fg">{address.city}</dd>
                            <dt className="text-muted">Address</dt><dd className="m-0 text-fg">{address.address}</dd>
                            <dt className="text-muted">Postal code</dt><dd className="m-0 text-fg">{address.postalCode || "-"}</dd>
                            <dt className="text-muted">Payment</dt><dd className="m-0 capitalize text-fg">{order.paymentMethod}</dd>
                        </dl>
                    ) : <p className="m-0 text-sm text-muted">No address.</p>}
                </div>
            </div>
        </div>
    )
}
