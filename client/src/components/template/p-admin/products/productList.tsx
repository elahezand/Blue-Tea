"use client"
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import swal from '@/components/modules/swal'
import Badge from '@/components/modules/badge'
import type { ID, Product } from '@/types/models'
import { categoryName, firstImage } from '@/utils/helper'
import { Chip, Actions, actGhost, actDanger } from '@/components/modules/p-admin/cells'
import { Spinner } from '@/components/feedBack/Loader'
import { useGetAdminProducts } from '@/services/product.service'

export default function ProductList() {
    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries())
    const { data: result, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useGetAdminProducts({ limit: 20, ...params })
    const data: Product[] = result?.items ?? []

    const removeProduct = (id: ID) => {
        swal({
            title: "Are You Sure To remove This item?",
            icon: "warning",
            buttons: ["No", "yes"]
        }).then(result => {
            if (result) {
                // TODO: delete request (removed for now): DELETE /products/:id. On success: toast + router.refresh()
                void id
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
                                <Image fill sizes="44px" src={firstImage(p.img)} alt="" className="no-tint object-cover" />
                            </span>
                            <span className="min-w-0">
                                <span className="block truncate font-medium text-fg">{p.name}</span>
                                <span className="block truncate text-xs text-muted">{p.shortDescription}</span>
                            </span>
                        </div>
                    </td>
                    <td><Chip>{categoryName(p.category) || "-"}</Chip></td>
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
            {isLoading && <tr><td colSpan={6} className="!py-10 text-center text-muted"><Spinner label="Loading" /></td></tr>}
            {isError && <tr><td colSpan={6} className="!py-10 text-center text-berry">Couldn&apos;t load the products.</td></tr>}
            {!isLoading && !isError && data.length === 0 && <tr><td colSpan={6} className="!py-10 text-center text-muted">No products match.</td></tr>}
            {hasNextPage && (
                <tr>
                    <td colSpan={6} className="!py-4 text-center">
                        <button type="button" onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="btn-ghost">
                            {isFetchingNextPage ? <Spinner label="Loading" /> : "Load more"}
                        </button>
                    </td>
                </tr>
            )}
        </tbody>
    )
}