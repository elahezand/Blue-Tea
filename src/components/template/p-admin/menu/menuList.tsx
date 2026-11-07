"use client"
import { useState } from 'react'
import { categoryName } from '@/utils/helper'
import type { ID, MenuItem } from '@/types/models'
import EditModal from '@/components/modules/modal/editModal'
import swal from '@/components/modules/swal'
import { Chip, Actions, actGhost, actDanger } from '@/components/modules/p-admin/cells'
export default function MenuList({ data }: { data: (MenuItem & { size?: string })[] }) {
    const [modal, setShowModal] = useState(false)
    const [item, setItem] = useState<(MenuItem & { size?: string }) | null>(null)
    
    const removeHandler = (id: ID) => {
        swal({
            title: "Are You Sure To remove This item?",
            icon: "warning",
            buttons: ["No", "yes"]
        }).then(result => {
            if (result) {
                // TODO: delete request (removed for now): DELETE /menu/:id. On success: toast + router.refresh()
                void id
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
                        <td><Chip>{categoryName(item.category) || "-"}</Chip></td>
                        <td className="whitespace-nowrap font-medium text-fg">${item.price}</td>
                        <td>
                            <Actions>
                                <button type="button" onClick={() => { setItem(item); setShowModal(true) }} className={actGhost}>Edit</button>
                                <button type="button" onClick={() => removeHandler(item._id)} className={actDanger}>Remove</button>
                            </Actions>
                        </td>
                    </tr>
                ))}
                {data.length === 0 && <tr><td colSpan={4} className="!py-10 text-center text-muted">No menu items match.</td></tr>}
            </tbody>
            {modal && item &&
                <EditModal
                    setShowModal={setShowModal}
                    title="Edit Item Menu"
                    item={item} />
            }
        </>
    )
}
