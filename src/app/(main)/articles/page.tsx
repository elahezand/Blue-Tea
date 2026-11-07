import type { RouteProps } from "@/types/api"
import React from 'react'
import { getArticles } from '@/services/article.service'
import { PageHeader } from '@/components/modules/motion'
import ArticlesList from '@/components/template/articles/articlesList'
export default async function page({ searchParams }: Pick<RouteProps, "searchParams">) {
    const searchparams = await searchParams
    const q = (searchparams?.q || "").toString().trim().slice(0, 60)
    const paginatedData = await getArticles({ ...searchparams, q })

    return (
        <>
            <PageHeader crumbs={["Journal"]} title="The journal" intro="Brewing guides, origin notes and news from the counter." />
            <div className="container py-10">
                <ArticlesList
                    key={q}
                    query={q}
                    nextCursor={paginatedData.nextCursor}
                    limit={paginatedData.limit}
                    data={paginatedData.data} />
            </div>
        </>

    )
}
