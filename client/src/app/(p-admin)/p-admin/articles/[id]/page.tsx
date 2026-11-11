import type { RouteProps } from "@/types/api"
import ArticleForm from "@/components/template/p-admin/articles/articleForm"

export default async function page({ params }: Pick<RouteProps<{ id: string }>, "params">) {
    const { id } = await params

    return (
        <>
            <h4 className="mb-4 font-bold text-fg">Edit Article</h4>
            <div className="transparentCard">
                <ArticleForm id={id} />
            </div>
        </>
    )
}
