"use client"
import Link from "next/link"
import Badge from "@/components/modules/badge"
import Table from "@/components/modules/table/table"
import TableState from "@/components/modules/table/tableState"
import { useGetMyOrders } from "@/services/order.service"
import { formatPrice } from "@/utils/helper"

export default function OrderClinet() {
    const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetMyOrders()
    const orders = data?.items ?? []

    return (
        <Table>
            <thead>
                <tr><th>Order</th><th>Status</th><th>Payment</th><th>Date</th><th>Total</th><th><span className="sr-only">Detail</span></th></tr>
            </thead>
            <tbody>
                {orders.map((o) => (
                    <tr key={o._id}>
                        <td className="whitespace-nowrap font-medium text-fg">#{String(o._id).slice(-6).toUpperCase()}</td>
                        <td><Badge value={o.status} /></td>
                        <td className="capitalize">{o.paymentMethod}</td>
                        <td className="whitespace-nowrap">{o.createdAt?.slice(0, 10)}</td>
                        <td className="whitespace-nowrap">{formatPrice(o.totalPrice)}</td>
                        <td className="text-end"><Link href={`/account/orders/${o._id}`} className="link-more">Detail</Link></td>
                    </tr>
                ))}
                <TableState colSpan={6} isLoading={isLoading} isError={isError} isEmpty={!orders.length} emptyText="No orders yet."
                    hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} />
            </tbody>
        </Table>
    )
}
