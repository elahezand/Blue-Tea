import React from 'react'
import Table from '@/components/modules/table/Table'
import connectToDB from '@/db/db'
import { paginate } from '@/utils/helper';
import { FaRegEdit } from "react-icons/fa";
import Pagination from '@/components/modules/pagination/pagination'
import contactModel from '@/model/contact';
import ContactsList from '@/components/template/p-admin/contacts/contactsList';

export default async function page({ searchParams }) {
    await connectToDB()
    const paginatedData = await paginate(contactModel, searchParams)
    return (
        <>
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Company</th>
                        <th>CreatedAT</th>
                        <th>Content</th>
                        <th><FaRegEdit /></th>
                    </tr>
                </thead>
                <ContactsList
                    data={JSON.parse(JSON.stringify(paginatedData.data))} />
            </Table>
            <Pagination
                href={`contacts?`}
                currentPage={paginatedData.page}
                pageCount={paginatedData.pageCount}
                limit={paginatedData.limit}
            />
        </>
    )

}
