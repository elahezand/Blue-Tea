import React from 'react'
import Table from '@/components/modules/table/Table'
import connectToDB from '@/db/db'
import { FaRegEdit } from "react-icons/fa";
import { paginate } from '@/utils/helper';
import Pagination from '@/components/modules/pagination/pagination'
import menuItemModel from '@/model/menuItem'
import MenuList from '@/components/template/p-admin/menu/menuList';


export default async function page({ searchParams }) {
    await connectToDB()
    const paginatedData = await paginate(menuItemModel, searchParams, {}, "category")
    return (
        <>
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th><FaRegEdit /></th>
                    </tr>
                </thead>
                <MenuList data={JSON.parse(JSON.stringify(paginatedData.data))} />
            </Table>
            <Pagination
                href={`menu?`}
                currentPage={paginatedData.page}
                pageCount={paginatedData.pageCount}
                limit={paginatedData.limit}
            />
        </>
    )

}
