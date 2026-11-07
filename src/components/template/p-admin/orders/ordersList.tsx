"use client"
import Link from 'next/link'
import swal from '@/components/modules/swal'
import Badge from '@/components/modules/badge'
import type { ID, OrderWithUser } from '@/types/models'
import { Person, Actions, actPrimary, actDanger, day } from '@/components/modules/p-admin/cells'

export default function OrdersList({ data }: { data: OrderWithUser[] }) {
    const removeHandeler = (id: ID) => {
        swal({
            title: "Are You Sure To remove This item?",
            icon: "warning",
            buttons: ["No", "yes"]
        }).then(result => {
            if (result) {
                // TODO: delete request (removed for now): DELETE /orders/:id. On success: toast + router.refresh()
                void id
            }
        })
    }
    return (
        <tbody>
            {data.map((item) => (
                <tr key={item._id}>
                    <td className="whitespace-nowrap font-medium text-fg">#{String(item._id).slice(-6).toUpperCase()}</td>
                    <td className="!max-w-[220px]"><Person name={item.user?.name} sub={item.user?.email} /></td>
                    <td className="whitespace-nowrap text-sm text-muted">{day(item.createdAt)}</td>
                    <td>
                        <div className="flex flex-col items-start gap-1">
                            <Badge value={item.isPaid ? "Paid" : "Unpaid"} />
                            {item.paymentMethod && <span className="text-xs text-muted">{item.paymentMethod}</span>}
                        </div>
                    </td>
                    <td><Badge value={item.status} /></td>
                    <td className="whitespace-nowrap font-medium text-fg">${item.totalPrice}</td>
                    <td>
                        <Actions>
                            <Link href={`/p-admin/orders?id=${item._id}`} className={actPrimary}>Detail</Link>
                            <button type="button" onClick={() => removeHandeler(item._id)} className={actDanger}>Remove</button>
                        </Actions>
                    </td>
                </tr>
            ))}
            {data.length === 0 && <tr><td colSpan={7} className="!py-10 text-center text-muted">No orders match.</td></tr>}
        </tbody>
    )
}
