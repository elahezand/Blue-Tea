import { Suspense } from "react"
import CommentsList from "@/components/template/p-admin/comments/commentsList"

export default function page() {
    return (
        <Suspense>
            <CommentsList />
        </Suspense>
    )
}
