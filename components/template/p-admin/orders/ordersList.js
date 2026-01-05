"use client"
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDelete } from '@/utils/hooks/useReactQueryPanel'
import toast from 'react-hot-toast'
import swal from 'sweetalert'

export default function OrdersList({ data }) {
    const router = useRouter()
    const { mutate } = useDelete(`/orders`, {
        onSuccess: (data) => {
            toast.success("Item Removed Successfully:)");
            router.refresh()
        },
        onError: (err) => {
            toast.error("Error creating order");
        },
    })
    const removeHandeler = async (id) => {
        swal({
            title: "Are You Sure To remove This item?",
            icon: "warning",
            buttons: ["No", "yes"]
        }).then(result => {
            if (result) {
                mutate(id)
            }
        })
    }
    return (
        <tbody>
            {data.map((item, index) => (
                <tr key={item._id}>
                    <td className="number">
                        <span>{index + 1}</span></td>
                    <td>{item.user?.name || "-"}</td>
                    <td>{item.status}</td>
                    <td>{item.paymentMethod}</td>
                    <td>{item.isPaid ? "true" : "false"}</td>
                    <td>{item.createdAt.slice(0, 10)}</td>
                    <td>$ {item.totalPrice}</td>
                    <td className='d-flex gap-1'>
                        <Link
                            href={`/p-admin/orders?id=${item._id}`}
                            className="edit">
                            Detail
                        </Link>
                        <button
                            onClick={() => removeHandeler(item._id)}
                            className="remove">
                            Remove
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    )
}
