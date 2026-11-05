"use client"
import { Spinner } from "@/components/feedBack/Loader"
import CommentForm from './commentForm'
import { MdStar, MdStarBorder } from "react-icons/md"
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import qs from "qs";
import axios from "axios";

export default function ProductComments({ productID, comments: initialData = [], nextCursor, limit }) {
    const [comments, setComments] = useState(initialData);
    const [cursor, setCursor] = useState(nextCursor)
    const [loading, setLoading] = useState(false);

    const queryString = qs.stringify({ cursor, limit, product: productID }, { encode: false });
    const { refetch } = useQuery({
        queryKey: [`/api/comments-${queryString}`],
        queryFn: async () => {
            const { data } = await axios.get(`/api/comments?${queryString}`);
            return data;
        },
        enabled: false,
    });

    const loadMore = async () => {
        setLoading(true);
        const res = await refetch();
        if (res.data) {
            setComments(prev => [...prev, ...res.data.data]);
            setCursor(res.data.nextCursor)
        }
        setLoading(false);
    };

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
