import React from 'react'
import TableToolbar from '@/components/modules/p-admin/TableToolbar'
import { userFilters } from '@/components/modules/p-admin/tableFilters'
import Table from '@/components/modules/table/Table'
import connectToDB from '@/configs/db'
import { paginate } from '@/utils/helper';
import Pagination from '@/components/modules/pagination/pagination'
import UserModal from '@/model/user'
import { Person, Chip, Actions, actGhost, actDanger, day } from '@/components/modules/p-admin/cells'


export default async function page({ searchParams }) {
    await connectToDB()
    const paginatedData = await paginate(UserModal, await searchParams)

    return (
        <>
            <Table title={"All Users"} toolbar={<TableToolbar fields={userFilters} />}>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {JSON.parse(JSON.stringify(paginatedData.data)).map((u) => (
                        <tr key={u._id}>
                            <td className="!max-w-[260px]"><Person name={u.name} sub={u.email} /></td>
                            <td className="whitespace-nowrap">{u.phone || "-"}</td>
                            <td><Chip tone={String(u.role).toUpperCase() === "ADMIN" ? "brand" : "plain"}>{u.role}</Chip></td>
                            <td className="whitespace-nowrap text-sm text-muted">{day(u.createdAt)}</td>
                            <td>
                                <Actions>
                                    <button type="button" className={actGhost}>Edit</button>
                                    <button type="button" className={actDanger}>Ban</button>
                                    <button type="button" className={actDanger}>Remove</button>
                                </Actions>
                            </td>
                        </tr>
                    ))}
                    {paginatedData.data.length === 0 && <tr><td colSpan="5" className="!py-10 text-center text-muted">No users match.</td></tr>}
                </tbody>
            </Table>
            <Pagination
                href={`users?`}
                currentPage={paginatedData.page}
                pageCount={paginatedData.pageCount}
                limit={paginatedData.limit} />
        </>
    )

}
