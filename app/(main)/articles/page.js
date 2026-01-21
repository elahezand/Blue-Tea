import React from 'react'
import connectToDB from '@/configs/db'
import ArticleModel from '@/model/article'
import ArticlesList from '@/components/template/articles/articlesList'
import { paginate } from '@/utils/helper'
export default async function page({ searchParams }) {
    await connectToDB()
    const searchparams = await searchParams
    const paginatedData = await paginate(ArticleModel, searchparams, {}, null, true, false)

    return (
        <div className="py-5">
            <div className="header mb-5">
                <h1 className="text-white">Our Article</h1>
            </div>
            <div className="container-fluid">
                <ArticlesList
                    nextCursor={paginatedData.nextCursor}
                    limit={paginatedData.limit}
                    data={JSON.parse(JSON.stringify(paginatedData.data))} />
            </div>
        </div>

    )
}
