import React from 'react'
import Table from '@/components/modules/table/Table'
import connectToDB from '@/db/db'
import ProductModal from '@/model/product'
import { paginate } from '@/utils/helper'
import ProductList from '@/components/template/p-admin/products/productList'
import { FaRegEdit } from "react-icons/fa";
import Pagination from '@/components/modules/pagination/pagination'

export default async function page({ searchParams }) {
    await connectToDB()
    const paginatedData = await paginate(ProductModal, searchParams, {}, "category")

    return (
        <>
            <Table title={"All Products"}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Score</th>
                        <th>Category</th>
                        <th>Available</th>
                        <th><FaRegEdit /></th>
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
