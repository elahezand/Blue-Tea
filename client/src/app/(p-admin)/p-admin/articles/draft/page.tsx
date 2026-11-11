import type { RouteProps } from "@/types/api"
import ArticleForm from "@/components/template/p-admin/articles/articleForm"
import { getParam } from "@/utils/helper"

export default async function page({ searchParams }: Pick<RouteProps, "searchParams">) {
    const id = getParam((await searchParams).id)

    return (
        <>
            <h4 className="mb-4 font-bold text-fg">Article Draft</h4>
            <div className="transparentCard">
                <ArticleForm id={id} />
            </div>
        </>
    )
}
