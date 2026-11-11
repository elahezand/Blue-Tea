"use client"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import Badge from "@/components/modules/badge"
import Table from "@/components/modules/table/table"
import TableState from "@/components/modules/table/tableState"
import TableToolbar from "@/components/modules/p-admin/tableToolbar"
import { orderFilters } from "@/components/modules/p-admin/tableFilters"
import { Person, Actions, actPrimary, actGhost, day } from "@/components/modules/p-admin/cells"
import { useGetAdminOrders, useShipOrder } from "@/services/order.service"
import { formatPrice } from "@/utils/helper"

export default function OrdersList() {
    const params = Object.fromEntries(useSearchParams().entries())
    const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetAdminOrders(params)
    const { mutate: ship, isPending: shipping, variables: shipVars } = useShipOrder()
    const orders = data?.items ?? []

    return (
        <Table title="All Orders" toolbar={<TableToolbar fields={orderFilters} />}>
            <thead>
                <tr><th>Order</th><th>Customer</th><th>Date</th><th>Payment</th><th>Status</th><th>Total</th><th>Actions</th></tr>
            </thead>
            <tbody>
                {orders.map((o) => {
                    const canShip = !o.canceledAt && !o.shippedAt && (o.isPaid || o.paymentMethod === "cash")
                    return (
                        <tr key={o._id}>
                            <td className="whitespace-nowrap font-medium text-fg">#{String(o._id).slice(-6).toUpperCase()}</td>
                            <td className="!max-w-[220px]"><Person name={o.user?.name} sub={o.user?.email} /></td>
                            <td className="whitespace-nowrap text-sm text-muted">{day(o.createdAt)}</td>
                            <td>
                                <div className="flex flex-col items-start gap-1">
                                    <Badge value={o.isPaid ? "Paid" : "Unpaid"} />
                                    <span className="text-xs capitalize text-muted">{o.paymentMethod}</span>
                                </div>
                            </td>
                            <td><Badge value={o.status} /></td>
                            <td className="whitespace-nowrap font-medium text-fg">{formatPrice(o.totalPrice)}</td>
                            <td>
                                <Actions>
                                    <Link href={`/p-admin/orders/${o._id}`} className={actGhost}>Detail</Link>
                                    {canShip && <button type="button" disabled={shipping && shipVars?.id === o._id} onClick={() => ship({ id: o._id })} className={actPrimary}>Ship</button>}
                                </Actions>
                            </td>
                        </tr>
                    )
                })}
                <TableState colSpan={7} isLoading={isLoading} isError={isError} isEmpty={!orders.length} emptyText="No orders match."
                    hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} />
            </tbody>
        </Table>
    )
}
