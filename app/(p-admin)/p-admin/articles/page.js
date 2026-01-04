import React from 'react'
import Table from '@/components/modules/table/Table'
import connectToDB from '@/db/db'
import ArticleModel from '@/model/article'
import { FaRegEdit } from "react-icons/fa";
import { paginate } from '@/utils/helper';
import Pagination from '@/components/modules/pagination/pagination'
import ArticlesList from '@/components/template/p-admin/articles/articlesList'


export default async function page({ searchParams }) {
   await connectToDB()
    const paginatedData = await paginate(ArticleModel, searchParams)
    return (
        <>
            <Table title={"Latest Articles"}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>shortDescription</th>
                        <th>Status</th>
                        <th><FaRegEdit /></th>
                    </tr>
                </thead>
                <ArticlesList
                    data={JSON.parse(JSON.stringify(paginatedData.data))} />
            </Table>
            <Pagination
                href={`articles?`}
                currentPage={paginatedData.page}
                pageCount={paginatedData.pageCount}
                limit={paginatedData.limit}
            />
        </>
    )

}
