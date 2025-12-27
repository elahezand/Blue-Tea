import React from 'react'
import connectToDB from '@/db/db'
import ArticleModel from '@/model/article'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/components/template/index/articles/articles.module.css';

export default async function page({ searchParams }) {
    await connectToDB()
    const limit = Number(searchParams.limit) || 15;
    const cursor = searchParams.cursor || null;
    const query = {};
    if (cursor) query._id = { $gt: cursor };

    const articles = await ArticleModel
        .find(query)
        .sort({ _id: 1 })
        .limit(limit + 1)
        .lean();

    const hasNextPage = articles.length > limit;
    if (hasNextPage) articles.pop();

    const nextCursor = hasNextPage
        ? articles[articles.length - 1]._id.toString()
        : null;



    return (
        <div className="py-5">
            <div className="header mb-5">
                <h1 className="text-white">Our Article</h1>
            </div>
            <div className="container">
                <div className="row gap-5 align-items-center justify-content-center">
                    {articles.map((a) => (
                        <div key={a._id} className="col-md-3">
                            <div className={styles.article_image_wrap}>
                                <Image
                                    src={a.cover}
                                    alt={a.title}
                                    width={300}
                                    height={200}
                                    priority
                                    className={styles.article_image}
                                />
                                <Link href={`/articles/${a._id}`} className={styles.article_overlay}>
                                    <h5>{a.title}</h5>
                                    <p>{a.shortDescription}</p>
                                    <span className={styles.author}>{a.author}</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {nextCursor && (
                <div className="mt-4 text-center">
                    <Link
                        className='classic'
                        href={`/articles?cursor=${nextCursor}&limit=${limit}`}>
                        Load more
                    </Link>
                </div>
            )}
        </div>

    )
}
