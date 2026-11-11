"use client"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import swal from "@/components/modules/swal"
import Badge from "@/components/modules/badge"
import Table from "@/components/modules/table/table"
import TableState from "@/components/modules/table/tableState"
import TableToolbar from "@/components/modules/p-admin/tableToolbar"
import { productFilters } from "@/components/modules/p-admin/tableFilters"
import { Chip, Actions, actGhost, actDanger } from "@/components/modules/p-admin/cells"
import { useGetAdminCategories } from "@/services/category.service"
import { useGetAdminProducts, useRemoveProduct } from "@/services/product.service"
import { categoryName, firstImage, formatPrice } from "@/utils/helper"
import type { ID } from "@/types/api"

export default function ProductList() {
    const params = Object.fromEntries(useSearchParams().entries())
    const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetAdminProducts(params)
    const { data: categories } = useGetAdminCategories({ type: "shop" })
    const { mutate: removeProduct, isPending: removing, variables: removingId } = useRemoveProduct()
    const products = data?.items ?? []
    const categoryOptions = (categories?.items ?? []).map((c) => ({ value: c._id, label: c.name }))

    const remove = (id: ID) => swal({ title: "Delete this product?", icon: "warning", buttons: ["No", "Yes"] })
        .then((ok) => { if (ok) removeProduct(id) })

    return (
        <Table title="All Products" toolbar={<TableToolbar fields={productFilters(categoryOptions)} />}>
            <thead>
                <tr><th>Product</th><th>Category</th><th>Price</th><th>Rating</th><th>Stock</th><th>Actions</th></tr>
            </thead>
            <tbody>
                {products.map((p) => (
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
                        <td className="whitespace-nowrap font-medium text-fg">{formatPrice(p.price)}</td>
                        <td className="whitespace-nowrap text-sm"><span className="text-[var(--lamp)]">★</span> {p.score ?? "-"}</td>
                        <td><Badge value={p.isAvailable ? "In Stock" : "Out Of Stock"} /></td>
                        <td>
                            <Actions>
                                <Link href={`/p-admin/products/${p._id}`} className={actGhost}>Edit</Link>
                                <button type="button" disabled={removing && removingId === p._id} onClick={() => remove(p._id)} className={actDanger}>Remove</button>
                            </Actions>
                        </td>
                    </tr>
                ))}
                <TableState colSpan={6} isLoading={isLoading} isError={isError} isEmpty={!products.length} emptyText="No products match."
                    hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} />
            </tbody>
        </Table>
    )
}
