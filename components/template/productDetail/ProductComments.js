"use client"
import CommentForm from './commentForm'
import styles from "./productComments.module.css"
import { FaStar } from "react-icons/fa";
import { useQuery } from '@tanstack/react-query';
import { FaRegStar } from "react-icons/fa6";
import { useState } from 'react';
import qs from "qs";
export default function ProductComments({ productID, comments: initialData, nextCursor, limit }) {

    const [comments, setComments] = useState(initialData);
    const [cursor, setCursor] = useState(nextCursor)
    const [loading, setLoading] = useState(false);

    let queryString = qs.stringify({ cursor, limit },
        { encode: false, });        

    const queryKey = [`/api/comments-${queryString}`]

    const { refetch } = useQuery({
        queryKey,
        queryFn: async () => {
            const { data } = await axios.get(`/api/comments?${queryString}`);
            return data;
        },
    });

    const loadMore = async () => {
        setLoading(true);
        const res = await refetch();

        setComments(prev => [...prev, ...res.data.data]);
        setCursor(res.data.nextCursor)
        setLoading(false);
    };
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-12">
                    <h3 className={styles.title}>Reviews</h3>
                    {/* Example review */}
                    {comments?.length ? comments.map((c, index) => (
                        <div key={index + 1} className={styles.card}>
                            <div className="d-flex align-items-center mb-2 justify-content-between">
                                <div>
                                    <span>{c.username}</span>
                                    <span className='ms-3'>{new Date(c.date).toISOString().slice(0, 10)}</span>
                                </div>
                                <div className={styles.stars}>
                                    {new Array(c.score).fill(0).map((item, index) => (
                                        <FaStar key={index} />
                                    ))}
                                    {new Array(5 - c.score).fill(0).map((item, index) => (
                                        <FaRegStar key={index} />
                                    ))}
                                </div>
                            </div>
                            <p>{c.body}</p>
                        </div>
                    )) : null}
                    <hr />
                    {cursor && (
                        <div className="mt-5 col-12">
                            <button onClick={loadMore}
                                className="classic w-100"
                                disabled={loading}>
                                {loading ? "Loading..." : "Load more"}
                            </button>
                        </div>
                    )}
                    {/* Comment form */}
                    <CommentForm
                        productID={productID} />
                </div>
            </div>
        </div>

    )
}
