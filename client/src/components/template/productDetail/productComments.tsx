"use client"
import { Spinner } from "@/components/feedback/loader"
import CommentForm from './commentForm'
import { MdStar, MdStarBorder } from "react-icons/md"
import { useInfiniteProductComments } from '@/services/comment.service';
import type { CursorPaginated } from '@/types/api';
import type { ID } from "@/types/api"
import type { Comment } from "@/types/comment"

interface ProductCommentsProps {
    productID: ID
    initialPage?: CursorPaginated<Comment> | null
}

const day = (value?: string) => (value ? new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : null)

export default function ProductComments({ productID, initialPage }: ProductCommentsProps) {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteProductComments(productID, initialPage ?? undefined)
    const comments = data?.items ?? []
    const cursor = hasNextPage
    const loading = isFetchingNextPage
    const loadMore = () => { if (hasNextPage && !isFetchingNextPage) fetchNextPage() }

    return (
        <section id="reviews" className="scroll-mt-24 !pb-0 !pt-16 lg:!pt-24" aria-labelledby="reviews-title">
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
                                        {day(c.createdAt) && <span className="text-sm text-muted">{day(c.createdAt)}</span>}
                                        {c.editedAt && <span className="text-xs text-muted">(edited)</span>}
                                    </div>
                                    <p className="m-0 max-w-prose text-fg">{c.body}</p>

                                    {c.answer?.length ? (
                                        <ul className="m-0 mt-4 list-none space-y-3 p-0">
                                            {c.answer.map((a) => (
                                                <li key={a._id} className="ms-4 rounded-e-xl border-s-2 border-solid border-[var(--lamp)] bg-soft px-4 py-3">
                                                    <div className="mb-1 flex flex-wrap items-center gap-x-3 text-sm">
                                                        <span className="font-medium text-[var(--head)]">{a.username || "Blue Tea"}</span>
                                                        <span className="script text-base text-[var(--script)]">replied</span>
                                                        {day(a.createdAt) && <span className="text-muted">{day(a.createdAt)}</span>}
                                                    </div>
                                                    <p className="m-0 max-w-prose text-sm leading-relaxed text-fg">{a.text}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : null}
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