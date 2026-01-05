import Table from '@/components/modules/table/Table'
import connectToDB from '@/db/db'
import { FaRegEdit } from "react-icons/fa";
import { paginate } from '@/utils/helper';
import Pagination from '@/components/modules/pagination/pagination'
import commentModel from '@/model/comment';
import CommentsList from '@/components/template/p-admin/comments/commentsList';


export default async function page({ searchParams }) {
    await connectToDB()
    const paginatedData = await paginate(commentModel, searchParams, {}, "productID")
   
    return (
        <>
            <Table title={"All Comments"}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Score</th>
                        <th>CreatedAT</th>
                        <th>ProductName</th>
                        <th>Content</th>
                        <th><FaRegEdit /></th>
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
