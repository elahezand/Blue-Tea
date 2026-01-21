import React from 'react'
import Table from '@/components/modules/table/Table'
import connectToDB from '@/configs/db'
import { FaRegEdit } from "react-icons/fa";
import Pagination from '@/components/modules/pagination/pagination'
import { paginate } from '@/utils/helper';
import reservationModal from '@/model/reservation';

export default async function page({ searchParams }) {
    await connectToDB()
    const paginatedData = await paginate(reservationModal, searchParams)

    return (
        <>
            <Table title={"All Reservations"}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Guests</th>
                        <th>Notes</th>
                        <th>Status</th>
                        <th><FaRegEdit /></th>
                    </tr>
                </thead>
                <tbody>
                    {JSON.parse(JSON.stringify(paginatedData.data)).map((r, index) => (
                        <tr key={index + 1}>
                            <td className="number">
                                <span>{index + 1}</span></td>
                            <td>{r.name}</td>
                            <td>{r.email}</td>
                            <td> {r.phone}</td>
                            <td>{r.date?.slice(0, 10)}</td>
                            <td>{r.time}</td>
                            <td>{r.guests}</td>
                            <td>
                                <button
                                    className="classic">
                                    Content
                                </button>
                            </td>
                            <td>{r.status}</td>
                            <td className="d-flex gap-1">
                                <button
                                    className='edit'>
                                    Edit
                                </button>
                                <button
                                    className='remove'>
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Pagination
                href={`reservations?`}
                currentPage={paginatedData.page}
                pageCount={paginatedData.pageCount}
                limit={paginatedData.limit}
            />
        </>
    )

}
