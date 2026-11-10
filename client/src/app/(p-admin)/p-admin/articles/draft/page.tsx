import type { RouteProps } from "@/types/api"
import AddNewArticle from "@/components/template/p-admin/articles/addNewArticle"
import { getArticleById } from "@/services/article.service"
import { getParam } from "@/utils/helper"
export default async function page({ searchParams }: Pick<RouteProps, "searchParams">) {
    const id = getParam((await searchParams).id)
    const article = id ? await getArticleById(id) : null

    return (
        <>
            <h4 className="font-bold text-fg mb-4">
                Article Draft
            </h4>
            <div className="transparentCard">
                <AddNewArticle
                    article={article} />
            </div>
        </>
    )
}
