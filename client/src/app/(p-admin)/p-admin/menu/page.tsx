import type { RouteProps } from "@/types/api"
import React from 'react'
import TableToolbar from '@/components/modules/p-admin/TableToolbar'
import { menuFilters } from '@/components/modules/p-admin/tableFilters'
import Table from '@/components/modules/table/Table'
import Pagination from '@/components/modules/pagination/pagination'
import { getAdminMenuItems } from '@/services/menu.service'
import MenuList from '@/components/template/p-admin/menu/menuList';


export default async function page({ searchParams }: Pick<RouteProps, "searchParams">) {
    const paginatedData = await getAdminMenuItems(await searchParams)
    const categories: string[] = []
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
                <MenuList data={paginatedData.data} />
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