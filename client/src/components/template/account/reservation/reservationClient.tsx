"use client"
import Badge from "@/components/modules/badge"
import Loader from '@/components/feedBack/Loader'
import Table from '@/components/modules/table/Table'
import Pagination from '@/components/modules/pagination/pagination'
import { MdOutlineEdit } from "react-icons/md"
import { useProfile } from "@/services/user.service"
import type { Paginated } from '@/types/api';
import type { Reservation } from '@/types/models';
export default function ReservationClient() {
    const { data: user } = useProfile();
    const userId = user?._id;

    void userId
    const data = null as Paginated<Reservation> | null
    const isLoading = false
    if (isLoading) return <Loader inline label="Loading your reservations" />

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
                        <th><MdOutlineEdit aria-hidden /><span className="sr-only">Actions</span></th>

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
                            <td><Badge value={r.status} /></td>
                            <td>
                                <button
                                    className="classic">
                                    Content
                                </button>
                            </td>
                            <td className="text-center">
                                <button
                                    className="remove">
                                    Cancel
                                </button>
                            </td>
                        </tr>
                    )) : <tr><td colSpan={7} className="py-6 text-center text-muted">No reservations yet.</td></tr>}
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
