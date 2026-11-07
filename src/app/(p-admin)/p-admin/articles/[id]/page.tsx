import type { RouteProps } from "@/types/api"

import EditArticle from "@/components/template/p-admin/articles/editArticle";
import { getArticleById } from "@/services/article.service";

export default async function page({ params }: Pick<RouteProps<{ id: string }>, "params">) {
    const { id } = await params
    const article = await getArticleById(id)

    return (
        <div>
            <h4 className="font-bold mb-4 text-fg">
                Edit Article
            </h4>
            <div className="transparentCard">
                <EditArticle
                    data={article} />
            </div>
        </div>
    );
}
