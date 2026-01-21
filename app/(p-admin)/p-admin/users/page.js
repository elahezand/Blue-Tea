import React from 'react'
import Table from '@/components/modules/table/Table'
import connectToDB from '@/configs/db'
import { paginate } from '@/utils/helper';
import { FaRegEdit } from "react-icons/fa";
import Pagination from '@/components/modules/pagination/pagination'
import UserModal from '@/model/user'


export default async function page({ searchParams }) {
    await connectToDB()
    const paginatedData = await paginate(UserModal, searchParams)

    return (
        <>
            <Table title={"All Users"}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th><FaRegEdit /></th>
                    </tr>
                </thead>
                <tbody>
                    {JSON.parse(JSON.stringify(paginatedData.data)).map((u, index) => (
                        <tr key={index + 1}>
                            <td className="number">
                                <span>{index + 1}</span></td>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td> {u.phone}</td>
                            <td>{u.role}</td>
                            <td className="d-flex gap-1">
                                <button className='remove'>
                                    Ban
                                </button>
                                <button className='edit'>
                                    Edit
                                </button>
                                <button className='remove'>
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
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
