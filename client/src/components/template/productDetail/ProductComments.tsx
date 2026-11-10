"use client"
import { Spinner } from "@/components/feedBack/Loader"
import CommentForm from './commentForm'
import { MdStar, MdStarBorder } from "react-icons/md"
import { useInfiniteProductComments } from '@/services/comment.service';
import type { CursorPaginated } from '@/types/api';
import type { Comment, ID } from '@/types/models';

interface ProductCommentsProps {
    productID: ID
    /** first page rendered on the server (null: the browser asks for it) */
    initialPage?: CursorPaginated<Comment> | null
}

export default function ProductComments({ productID, initialPage }: ProductCommentsProps) {
    // first page from the server, "Show more reviews" in the browser (services/comment.service.ts)
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteProductComments(productID, initialPage ?? undefined)
    const comments = data?.items ?? []
    const cursor = hasNextPage
    const loading = isFetchingNextPage
    const loadMore = () => { if (hasNextPage && !isFetchingNextPage) fetchNextPage() }

    return (
        <section className="!pb-0 !pt-16 lg:!pt-24" aria-labelledby="reviews-title">
            <div className="grid gap-12 lg:grid-cols-12">
                <div className="lg:col-span-7">
                    <h2 id="reviews-title" className="mb-6 text-2xl font-semibold text-[var(--head)]">Reviews{comments.length ? ` (${comments.length}${cursor ? "+" : ""})` : ""}</h2>
                    {comments.length === 0 ? (
                        <p className="text-muted">No reviews yet. Be the first to write one.</p>
                    ) : (
                        <ul className="m-0 list-none border-t-2 border-dotted border-line p-0">
                            {comments.map((c, index) => (
                                <li key={c._id || index} className="border-b border-dotted border-line py-5">
                                    <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                                        <span className="font-medium text-fg">{c.username}</span>
                                        <span className="inline-flex gap-0.5" role="img" aria-label={`${c.score} out of 5 stars`}>
                                            {Array.from({ length: 5 }, (_, i) => i < c.score
                                                ? <MdStar key={i} size={12} color="var(--lamp)" />
                                                : <MdStarBorder key={i} size={12} color="var(--lamp)" />)}
                                        </span>
                                        {c.date && <span className="text-sm text-muted">{new Date(c.date).toISOString().slice(0, 10)}</span>}
                                    </div>
                                    <p className="m-0 max-w-prose text-fg">{c.body}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                    {cursor && (
                        <button type="button" onClick={loadMore} disabled={loading}
                            className="btn-organic mt-8 bg-surface px-8 py-2.5 text-sm font-medium text-fg">
                            {loading ? <Spinner label="Loading" /> : "Show more reviews"}
                        </button>
                    )}
                </div>
                <div className="lg:col-span-5">
                    <CommentForm productID={productID} />
                </div>
            </div>
        </section>
    )
}
