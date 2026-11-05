import React from 'react'
import TableToolbar from '@/components/modules/p-admin/TableToolbar'
import { contactFilters } from '@/components/modules/p-admin/tableFilters'
import Table from '@/components/modules/table/Table'
import connectToDB from '@/configs/db'
import { paginate } from '@/utils/helper';
import Pagination from '@/components/modules/pagination/pagination'
import contactModel from '@/model/contact';
import ContactsList from '@/components/template/p-admin/contacts/contactsList';

export default async function page({ searchParams }) {
    await connectToDB()
    const paginatedData = await paginate(contactModel, searchParams)
    return (
        <>
            <Table title={"All Contacts"} toolbar={<TableToolbar fields={contactFilters} />}>
                <thead>
                    <tr>
                        <th>From</th>
                        <th>Message</th>
                        <th>Received</th>
                        <th>Status</th>
                        <th>Actions</th>
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
