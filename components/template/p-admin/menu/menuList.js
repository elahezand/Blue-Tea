"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDelete } from '@/utils/hooks/useReactQueryPanel'
import EditModal from '@/components/modules/modal/editModal'
import toast from 'react-hot-toast'
import swal from '@/components/modules/swal'
import { Chip, Actions, actGhost, actDanger } from '@/components/modules/p-admin/cells'
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
                {data.map((item) => (
                    <tr key={item._id}>
                        <td className="!max-w-[380px]">
                            <span className="block truncate font-medium text-fg">{item.name}</span>
                            <span className="block truncate text-xs text-muted">{item.description}</span>
                        </td>
                        <td><Chip>{item.category?.name || "-"}</Chip></td>
                        <td className="whitespace-nowrap font-medium text-fg">${item.price}</td>
                        <td>
                            <Actions>
                                <button type="button" onClick={() => { setItem(item); setShowModal(true) }} className={actGhost}>Edit</button>
                                <button type="button" onClick={() => removeHandler(item._id)} className={actDanger}>Remove</button>
                            </Actions>
                        </td>
                    </tr>
                ))}
                {data.length === 0 && <tr><td colSpan="4" className="!py-10 text-center text-muted">No menu items match.</td></tr>}
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
