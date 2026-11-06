import "@/model/category"
import React from 'react'
import TableToolbar from '@/components/modules/p-admin/TableToolbar'
import { productFilters } from '@/components/modules/p-admin/tableFilters'
import Table from '@/components/modules/table/Table'
import connectToDB from '@/configs/db'
import ProductModal from '@/model/product'
import { paginate } from '@/utils/helper'
import ProductList from '@/components/template/p-admin/products/productList'
import Pagination from '@/components/modules/pagination/pagination'

export default async function page({ searchParams }) {
    await connectToDB()
    const paginatedData = await paginate(ProductModal, await searchParams, {}, "category")

    return (
        <>
            <Table title={"All Products"} toolbar={<TableToolbar fields={productFilters()} />}>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Rating</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <ProductList
                    data={JSON.parse(JSON.stringify(paginatedData.data))} />
            </Table>
            <Pagination
                href={`products?`}
                currentPage={paginatedData.page}
                pageCount={paginatedData.pageCount}
                limit={paginatedData.limit} />
        </>
    )

}
