"use client"
import Badge from "@/components/modules/badge"
import Loader from '@/components/feedBack/Loader'
import Table from '@/components/modules/table/Table';
import Pagination from '@/components/modules/pagination/pagination';
import { MdOutlineEdit } from "react-icons/md"
import { useProfile } from '@/hooks/useProfile';
import type { Paginated } from '@/types/api';
import type { Order } from '@/types/models';

export default function OrderClinet() {
    const { data: user } = useProfile();
    const userId = user?._id;
    // TODO: my-orders request (removed for now): GET /orders/user/:userId
    void userId
    const data = null as Paginated<Order> | null
    const isLoading = false
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
                                <td>{item.createdAt?.slice(0, 10)}</td>
                                <td>$ {item.totalPrice}</td>
                                <td className="text-center">
                                    <button
                                        className="edit">
                                        Detail
                                    </button>
                                </td>
                            </tr>
                        )) : <tr><td colSpan={6} className="py-6 text-center text-muted">No orders yet.</td></tr>}
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
