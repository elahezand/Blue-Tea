"use client"
import React from 'react'
import Table from '@/components/modules/table/Table';
import { useGet } from '@/utils/hooks/useReactQueryPanel';
import Pagination from '@/components/modules/pagination/pagination';
import { FaRegEdit } from "react-icons/fa";
import { useContext } from 'react';
import { UserContext } from '@/utils/context/userProvider';

export default function OrderClinet() {
    const { user } = useContext(UserContext);
    const userId = user?.id || user?._id;

    const { data, isLoading } = useGet(
        `/orders/user/${userId}`,
        {},
        { enabled: !!userId }
    );
    if (isLoading) return <span className='fw-bold text-white fs-3'>Loading .....</span>

    return (
        <>

            <>
                <Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Status</th>
                            <th>Payment</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>
                                <FaRegEdit />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data ? data.data.map((item, index) => (
                            <tr key={item._id}>
                                <td className="number">
                                    <span>{index + 1}</span></td>
                                <td>{item.status}</td>
                                <td>{item.paymentMethod}</td>
                                <td>{item.createdAt.slice(0, 10)}</td>
                                <td>$ {item.totalPrice}</td>
                                <td className='btn'>
                                    <button
                                        className="edit">
                                        Detail
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
        </>
    )
}
