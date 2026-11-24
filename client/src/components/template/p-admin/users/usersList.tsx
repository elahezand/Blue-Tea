"use client"
import { Fragment, useState, type FormEvent } from "react"
import { useSearchParams } from "next/navigation"
import swal from "@/components/modules/swal"
import Badge from "@/components/modules/badge"
import Table from "@/components/modules/table/table"
import TableState from "@/components/modules/table/tableState"
import TableToolbar from "@/components/modules/p-admin/tableToolbar"
import { userFilters } from "@/components/modules/p-admin/tableFilters"
import { Person, Chip, Actions, actGhost, actDanger, day } from "@/components/modules/p-admin/cells"
import { useBanUser, useDeleteUser, useGetUsers, useUnbanUser } from "@/services/user.service"
import type { ID } from "@/types/api"
import type { User, UserListParams } from "@/types/user"

export default function UsersList() {
    const query = useSearchParams()
    const role = query.get("role")
    const status = query.get("status")
    const params: UserListParams = {
        q: query.get("q") || undefined,
        role: role === "USER" || role === "ADMIN" ? role : undefined,
        status: status === "active" || status === "banned" ? status : undefined,
        from: query.get("from") || undefined,
        to: query.get("to") || undefined,
    }
    const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetUsers(params)
    const [banId, setBanId] = useState<ID | null>(null)
    const [reason, setReason] = useState("")
    const [reasonError, setReasonError] = useState(false)
    const { mutate: ban, isPending: banning } = useBanUser()
    const { mutate: unban, isPending: unbanning } = useUnbanUser()
    const { mutate: deleteUser, isPending: deleting, variables: deletingId } = useDeleteUser()
    const users = data?.items ?? []

    const openBan = (id: ID) => {
        setReason("")
        setReasonError(false)
        setBanId(id)
    }
    const confirmBan = (event: FormEvent<HTMLFormElement>, id: ID) => {
        event.preventDefault()
        const trimmed = reason.trim()
        if (trimmed && trimmed.length < 3) {
            setReasonError(true)
            return
        }
        ban({ id, payload: trimmed ? { reason: trimmed } : {} }, { onSuccess: () => setBanId(null) })
    }
    const confirmDelete = (u: User) => swal({ title: `Delete ${u.name || u.phone || "this user"}?`, text: "This can't be undone.", icon: "warning", buttons: ["No", "Yes, delete"] })
        .then((ok) => { if (ok) deleteUser(u._id) })

    return (
        <Table title="All Users" toolbar={<TableToolbar fields={userFilters} />}>
            <thead>
                <tr><th>User</th><th>Phone</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
                {users.map((u) => (
                    <Fragment key={u._id}>
                        <tr>
                            <td className="!max-w-[260px]"><Person name={u.name} sub={u.email} /></td>
                            <td className="whitespace-nowrap">{u.phone || "-"}</td>
                            <td><Chip tone={u.role === "ADMIN" ? "brand" : "plain"}>{u.role}</Chip></td>
                            <td>
                                <Badge value={u.isBanned ? "Blocked" : "Active"} />
                                {u.isBanned && u.banReason && <p className="mt-1 whitespace-normal text-xs text-muted">{u.banReason}</p>}
                            </td>
                            <td className="whitespace-nowrap text-sm text-muted">{day(u.createdAt)}</td>
                            <td>
                                <Actions>
                                    {u.isBanned
                                        ? <button type="button" disabled={unbanning} onClick={() => unban({ id: u._id })} className={actGhost}>Unban</button>
                                        : u.role !== "ADMIN" && <button type="button" disabled={banning} aria-expanded={banId === u._id}
                                            onClick={() => openBan(u._id)} className={actDanger}>Ban</button>}
                                    {u.role !== "ADMIN" && <button type="button" disabled={deleting && deletingId === u._id} onClick={() => confirmDelete(u)} className={actDanger}>Remove</button>}
                                    {u.role === "ADMIN" && !u.isBanned && <span className="text-xs text-muted">Protected</span>}
                                </Actions>
                            </td>
                        </tr>
                        {banId === u._id && !u.isBanned && u.role !== "ADMIN" && (
                            <tr className="!bg-soft/30">
                                <td colSpan={6} className="!max-w-none !whitespace-normal">
                                    <form className="max-w-lg" noValidate onSubmit={(event) => confirmBan(event, u._id)}>
                                        <label htmlFor={`ban-reason-${u._id}`} className="field-label">Reason for ban (optional)</label>
                                        <textarea id={`ban-reason-${u._id}`} rows={2} maxLength={300} autoFocus value={reason} disabled={banning}
                                            aria-invalid={reasonError} aria-describedby={reasonError ? `ban-error-${u._id}` : undefined}
                                            onChange={(event) => { setReason(event.target.value); setReasonError(false) }} className="field mb-2 resize-y" />
                                        {reasonError && <p id={`ban-error-${u._id}`} role="alert" className="mb-2 text-sm text-berry">Enter at least 3 characters or leave the reason blank.</p>}
                                        <div className="flex gap-2">
                                            <button type="button" disabled={banning} onClick={() => setBanId(null)} className={actGhost}>Cancel</button>
                                            <button type="submit" disabled={banning} className={actDanger}>{banning ? "Banning…" : "Confirm ban"}</button>
                                        </div>
                                    </form>
                                </td>
                            </tr>
                        )}
                    </Fragment>
                ))}
                <TableState colSpan={6} isLoading={isLoading} isError={isError} isEmpty={!users.length} emptyText="No users match."
                    hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} />
            </tbody>
        </Table>
    )
}
