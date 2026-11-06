import "@/model/category"
import React from 'react'
import TableToolbar from '@/components/modules/p-admin/TableToolbar'
import { menuFilters } from '@/components/modules/p-admin/tableFilters'
import Table from '@/components/modules/table/Table'
import connectToDB from '@/configs/db'
import { paginate } from '@/utils/helper';
import Pagination from '@/components/modules/pagination/pagination'
import menuItemModel from '@/model/menuItem'
import CategoryModel from '@/model/category'
import MenuList from '@/components/template/p-admin/menu/menuList';


export default async function page({ searchParams }) {
    await connectToDB()
    const paginatedData = await paginate(menuItemModel, await searchParams, {}, "category")
    const categories = (await CategoryModel.find({}).select('name').lean().catch(() => [])).map((c) => c.name).filter(Boolean)
    return (
        <>
            <Table title={"All MenuItems"} toolbar={<TableToolbar fields={menuFilters(categories)} />}>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Section</th>
                        <th>Price</th>
                        <th>Actions</th>
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
