import React from 'react'
import TableToolbar from '@/components/modules/p-admin/TableToolbar'
import { articleFilters } from '@/components/modules/p-admin/tableFilters'
import Table from '@/components/modules/table/Table'
import connectToDB from '@/configs/db'
import ArticleModel from '@/model/article'
import { paginate } from '@/utils/helper';
import Pagination from '@/components/modules/pagination/pagination'
import ArticlesList from '@/components/template/p-admin/articles/articlesList'


export default async function page({ searchParams }) {
   await connectToDB()
    const paginatedData = await paginate(ArticleModel, searchParams)
    return (
        <>
            <Table title={"All Articles"} toolbar={<TableToolbar fields={articleFilters} />}>
                <thead>
                    <tr>
                        <th>Article</th>
                        <th>Author</th>
                        <th>Written</th>
                        <th>Status</th>
                        <th>Actions</th>
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
