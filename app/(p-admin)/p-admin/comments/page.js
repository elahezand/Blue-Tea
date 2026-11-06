import "@/model/product"
import TableToolbar from '@/components/modules/p-admin/TableToolbar'
import { commentFilters } from '@/components/modules/p-admin/tableFilters'
import Table from '@/components/modules/table/Table'
import connectToDB from '@/configs/db'
import { paginate } from '@/utils/helper';
import Pagination from '@/components/modules/pagination/pagination'
import commentModel from '@/model/comment';
import CommentsList from '@/components/template/p-admin/comments/commentsList';


export default async function page({ searchParams }) {
    await connectToDB()
    const paginatedData = await paginate(commentModel, await searchParams, {}, "productID")
   
    return (
        <>
            <Table title={"All Comments"} toolbar={<TableToolbar fields={commentFilters} />}>
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Comment</th>
                        <th>Posted</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <CommentsList data={JSON.parse(JSON.stringify(paginatedData.data))} />
            </Table>
            <Pagination
                href={`comments?`}
                currentPage={paginatedData.page}
                pageCount={paginatedData.pageCount}
                limit={paginatedData.limit}
            />
        </>
    )

}
