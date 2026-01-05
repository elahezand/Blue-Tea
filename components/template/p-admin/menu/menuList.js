"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDelete } from '@/utils/hooks/useReactQueryPanel'
import EditModal from '@/components/modules/modal/editModal'
import toast from 'react-hot-toast'
import swal from 'sweetalert'
export default function MenuList({ data }) {
    const router = useRouter()
    const { mutate } = useDelete(`/menu`, {
        onSuccess: (data) => {
            toast.success("Item Removed Successfully:)");
            router.refresh()
        },
        onError: (err) => {
            toast.error("Error creating order");
        },
    })
    const [modal, setShowModal] = useState(false)
    const [item, setItem] = useState("")
    
    const removeHandler = async (id) => {
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
        <>
            <tbody>
                {data.map((item, index) => (
                    <tr key={index + 1}>
                        <td className="number">
                            <span>{index + 1}</span></td>
                        <td> {item.name}</td>
                        <td>{item.description}</td>
                        <td> $ {item.price}</td>
                        <td>{item.category.name}</td>
                        <td className="d-flex gap-1">
                            <button
                                onClick={() => removeHandler(item._id)}
                                className='remove'>
                                Remove
                            </button>
                            <button
                                onClick={() => {
                                    setItem(item)
                                    setShowModal(true)
                                }}
                                className='edit'>
                                Edit
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
            {modal &&
                <EditModal
                    setShowModal={setShowModal}
                    title="Edit Item Menu"
                    item={item} />
            }
        </>
    )
}
