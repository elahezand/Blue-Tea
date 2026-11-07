import type { RouteProps } from "@/types/api"
import TableToolbar from '@/components/modules/p-admin/TableToolbar'
import { commentFilters } from '@/components/modules/p-admin/tableFilters'
import Table from '@/components/modules/table/Table'
import Pagination from '@/components/modules/pagination/pagination'
import { getAdminComments } from '@/services/comment.service';
import CommentsList from '@/components/template/p-admin/comments/commentsList';


export default async function page({ searchParams }: Pick<RouteProps, "searchParams">) {
    const paginatedData = await getAdminComments(await searchParams)
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
                <CommentsList data={paginatedData.data} />
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
