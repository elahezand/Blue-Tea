"use client"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import swal from "@/components/modules/swal"
import Table from "@/components/modules/table/table"
import TableState from "@/components/modules/table/tableState"
import TableToolbar from "@/components/modules/p-admin/tableToolbar"
import { menuFilters } from "@/components/modules/p-admin/tableFilters"
import { Chip, Actions, actGhost, actDanger } from "@/components/modules/p-admin/cells"
import MenuItemForm from "./menuItemForm"
import { useGetAdminMenu, useRemoveMenuItem, useUpdateMenuItem } from "@/services/menu.service"
import { applyFieldErrors } from "@/utils/apiError"
import { categoryName, formatPrice } from "@/utils/helper"
import type { ID } from "@/types/api"
import type { MenuItem } from "@/types/menu"

export default function MenuList() {
    const params = Object.fromEntries(useSearchParams().entries())
    const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetAdminMenu(params)
    const [editing, setEditing] = useState<MenuItem | null>(null)
    const { mutate: updateItem, isPending: saving } = useUpdateMenuItem(() => setEditing(null))
    const { mutate: removeItem } = useRemoveMenuItem()
    const items = data?.items ?? []

    const remove = (id: ID) => swal({ title: "Delete this menu item?", icon: "warning", buttons: ["No", "Yes"] })
        .then((ok) => { if (ok) removeItem(id) })

    return (
        <>
            <Table title="All Menu Items" toolbar={<TableToolbar fields={menuFilters} />}>
                <thead>
                    <tr><th>Item</th><th>Section</th><th>Price</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item._id}>
                            <td className="!max-w-[380px]">
                                <span className="block truncate font-medium text-fg">{item.name}</span>
                                <span className="block truncate text-xs text-muted">{item.description}</span>
                            </td>
                            <td><Chip>{categoryName(item.category) || "-"}</Chip></td>
                            <td className="whitespace-nowrap font-medium text-fg">{formatPrice(item.price)}</td>
                            <td>
                                <Actions>
                                    <button type="button" onClick={() => setEditing(item)} className={actGhost}>Edit</button>
                                    <button type="button" onClick={() => remove(item._id)} className={actDanger}>Remove</button>
                                </Actions>
                            </td>
                        </tr>
                    ))}
                    <TableState colSpan={4} isLoading={isLoading} isError={isError} isEmpty={!items.length} emptyText="No menu items match."
                        hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} />
                </tbody>
            </Table>
            {editing && (
                <div className="fixed inset-0 z-[10000] flex justify-center bg-black/60 px-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Edit menu item">
                    <div className="mt-20 h-fit max-h-[85vh] w-[560px] max-w-full animate-modal-pop overflow-y-auto rounded-3xl border border-solid border-line bg-surface p-7 shadow-2xl">
                        <div className="mb-5 flex items-center justify-between">
                            <h3 className="m-0 text-2xl" style={{ color: "var(--head)" }}>Edit menu item</h3>
                            <button type="button" aria-label="Close" onClick={() => setEditing(null)} className="flex size-9 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-2xl text-fg hover:bg-soft">&times;</button>
                        </div>
                        <MenuItemForm key={editing._id} item={editing} isPending={saving} submitLabel="Save" onCancel={() => setEditing(null)}
                            onSave={(formData, _done, setError) => updateItem({ id: editing._id, payload: formData }, { onError: (error) => applyFieldErrors(error, setError) })} />
                    </div>
                </div>
            )}
        </>
    )
}
