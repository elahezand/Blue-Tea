"use client"
import React, { useContext } from 'react'
import Table from '@/components/modules/table/Table'
import Pagination from '@/components/modules/pagination/pagination'
import { FaRegEdit } from "react-icons/fa";
import { UserContext } from '@/utils/context/userProvider';
import { useGet } from '@/utils/hooks/useReactQueryPublic';
export default function ReservationClient() {
    const { user } = useContext(UserContext);
    const userId = user?.id || user?._id;

    const { data, isLoading } = useGet(
        `/reservation/${userId}`,
        {},
        { enabled: !!userId }
    );
    if (isLoading) return
    <span className='fw-bold text-white fs-3'>Loading .....</span>

    return (
        <>
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Guests</th>
                        <th>Status</th>
                        <th>Notes</th>
                        <th><FaRegEdit /></th>

                    </tr>
                </thead>
                <tbody>
                    {data ? data.data.map((r, index) => (
                        <tr key={index + 1}>
                            <td className="number">
                                <span>{index + 1}</span></td>
                            <td>{r.date?.slice(0, 10)}</td>
                            <td>{r.time}</td>
                            <td>{r.guests}</td>
                            <td>{r.status}</td>
                            <td>
                                <button
                                    className="classic">
                                    Content
                                </button>
                            </td>
                            <td className="btn">
                                <button
                                    className='remove'>
                                    Cancel
                                </button>
                            </td>
                        </tr>
                    )) : <span className='text-white'>Not Found</span>}
                </tbody>
            </Table>
            <Pagination
                href={`reservations?`}
                currentPage={data?.page}
                pageCount={data?.pageCount}
                limit={data?.limit} />
        </>
    )
}
