import React from 'react'
import connectToDB from '@/configs/db'
import ArticleModel from '@/model/article'
import { PageHeader } from '@/components/modules/motion'
import ArticlesList from '@/components/template/articles/articlesList'
import { paginate } from '@/utils/helper'
export default async function page({ searchParams }) {
    await connectToDB()
    const searchparams = await searchParams
    const q = (searchparams?.q || "").toString().trim().slice(0, 60)
    const rx = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const filter = q ? { $or: [{ title: { $regex: rx, $options: "i" } }, { shortDescription: { $regex: rx, $options: "i" } }] } : {}
    const paginatedData = await paginate(ArticleModel, searchparams, filter, null, true, false)

    return (
        <>
            <PageHeader crumbs={["Journal"]} title="The journal" intro="Brewing guides, origin notes and news from the counter." />
            <div className="container py-10">
                <ArticlesList
                    key={q}
                    query={q}
                    nextCursor={paginatedData.nextCursor}
                    limit={paginatedData.limit}
                    data={JSON.parse(JSON.stringify(paginatedData.data))} />
            </div>
        </>

    )
}
