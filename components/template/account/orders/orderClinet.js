"use client"
import Badge from "@/components/modules/badge"
import Loader from '@/components/feedBack/Loader'
import React from 'react'
import Table from '@/components/modules/table/Table';
import { useGet } from '@/utils/hooks/useReactQueryPanel';
import Pagination from '@/components/modules/pagination/pagination';
import { MdOutlineEdit } from "react-icons/md"
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
    if (isLoading) return <Loader inline label="Loading your orders" />

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
                                <MdOutlineEdit />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data ? data.data.map((item, index) => (
                            <tr key={item._id}>
                                <td className="number">
                                    <span>{index + 1}</span></td>
                                <td><Badge value={item.status} /></td>
                                <td>{item.paymentMethod}</td>
                                <td>{item.createdAt.slice(0, 10)}</td>
                                <td>$ {item.totalPrice}</td>
                                <td className="text-center">
                                    <button
                                        className="edit">
                                        Detail
                                    </button>
                                </td>
                            </tr>
                        )) : <tr><td colSpan="6" className="py-6 text-center text-muted">No orders yet.</td></tr>}
                    </tbody>
                </Table>
                <Pagination
                    href={`orders?`}
                    currentPage={data?.page}
                    pageCount={data?.pageCount}
                    limit={data?.limit} />
            </>
        </>
    )
}
