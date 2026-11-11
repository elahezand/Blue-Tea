"use client"
import { useSearchParams } from "next/navigation"
import swal from "@/components/modules/swal"
import Badge from "@/components/modules/badge"
import Table from "@/components/modules/table/table"
import TableState from "@/components/modules/table/tableState"
import TableToolbar from "@/components/modules/p-admin/tableToolbar"
import { userFilters } from "@/components/modules/p-admin/tableFilters"
import { Person, Chip, Actions, actGhost, actDanger, day } from "@/components/modules/p-admin/cells"
import { useBanUser, useDeleteUser, useGetUsers, useUnbanUser } from "@/services/user.service"
import type { User } from "@/types/user"

export default function UsersList() {
    const params = Object.fromEntries(useSearchParams().entries())
    const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetUsers(params)
    const { mutate: ban, isPending: banning } = useBanUser()
    const { mutate: unban, isPending: unbanning } = useUnbanUser()
    const { mutate: deleteUser, isPending: deleting, variables: deletingId } = useDeleteUser()
    const users = data?.items ?? []

    const confirmBan = (u: User) => swal({ title: `Ban ${u.name}?`, text: "They will not be able to sign in.", icon: "warning", buttons: ["No", "Yes, ban"] })
        .then((ok) => { if (ok) ban({ id: u._id }) })
    const confirmDelete = (u: User) => swal({ title: `Delete ${u.name}?`, text: "This can't be undone.", icon: "warning", buttons: ["No", "Yes, delete"] })
        .then((ok) => { if (ok) deleteUser(u._id) })

    return (
        <Table title="All Users" toolbar={<TableToolbar fields={userFilters} />}>
            <thead>
                <tr><th>User</th><th>Phone</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
                {users.map((u) => (
                    <tr key={u._id}>
                        <td className="!max-w-[260px]"><Person name={u.name} sub={u.email} /></td>
                        <td className="whitespace-nowrap">{u.phone || "-"}</td>
                        <td><Chip tone={u.role === "ADMIN" ? "brand" : "plain"}>{u.role}</Chip></td>
                        <td><Badge value={u.isBanned ? "Blocked" : "Active"} /></td>
                        <td className="whitespace-nowrap text-sm text-muted">{day(u.createdAt)}</td>
                        <td>
                            <Actions>
                                {u.isBanned
                                    ? <button type="button" disabled={unbanning} onClick={() => unban({ id: u._id })} className={actGhost}>Unban</button>
                                    : <button type="button" disabled={banning} onClick={() => confirmBan(u)} className={actDanger}>Ban</button>}
                                <button type="button" disabled={deleting && deletingId === u._id} onClick={() => confirmDelete(u)} className={actDanger}>Remove</button>
                            </Actions>
                        </td>
                    </tr>
                ))}
                <TableState colSpan={6} isLoading={isLoading} isError={isError} isEmpty={!users.length} emptyText="No users match."
                    hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} />
            </tbody>
        </Table>
    )
}
