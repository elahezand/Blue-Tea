import { Suspense } from "react"
import ArticlesList from "@/components/template/p-admin/articles/articlesList"

export default function page() {
    return (
        <Suspense>
            <ArticlesList />
        </Suspense>
    )
}
