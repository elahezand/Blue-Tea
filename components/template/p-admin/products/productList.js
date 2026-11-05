"use client"
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useDelete } from '@/utils/hooks/useReactQueryPanel'
import toast from 'react-hot-toast'
import Link from 'next/link'
import swal from '@/components/modules/swal'
import Badge from '@/components/modules/badge'
import { Chip, Actions, actGhost, actDanger } from '@/components/modules/p-admin/cells'

export default function ProductList({ data }) {
    const router = useRouter()
    const { mutate } = useDelete(`/products`, {
        onSuccess: (data) => {
            toast.success("Item Removed Successfully :)")
            router.refresh()
        },
    })

    const removeProduct = (id) => {
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
            {data.map((p) => (
                <tr key={p._id}>
                    <td className="!max-w-[320px]">
                        <div className="flex items-center gap-3">
                            <span className="relative size-11 shrink-0 overflow-hidden rounded-xl bg-soft">
                                <Image fill sizes="44px" src={p.img} alt="" className="no-tint object-cover" />
                            </span>
                            <span className="min-w-0">
                                <span className="block truncate font-medium text-fg">{p.name}</span>
                                <span className="block truncate text-xs text-muted">{p.shortDescription}</span>
                            </span>
                        </div>
                    </td>
                    <td><Chip>{p.category?.name || "-"}</Chip></td>
                    <td className="whitespace-nowrap font-medium text-fg">${p.price}</td>
                    <td className="whitespace-nowrap text-sm"><span className="text-[var(--lamp)]">★</span> {p.score ?? "-"}</td>
                    <td><Badge value={p.isAvailable === true ? "In Stock" : "Out Of Stock"} /></td>
                    <td>
                        <Actions>
                            <Link href={`/p-admin/products/${p._id}`} className={actGhost}>Edit</Link>
                            <button type="button" onClick={() => removeProduct(p._id)} className={actDanger}>Remove</button>
                        </Actions>
                    </td>
                </tr>
            ))}
            {data.length === 0 && <tr><td colSpan="6" className="!py-10 text-center text-muted">No products match.</td></tr>}
        </tbody>
    )
}
