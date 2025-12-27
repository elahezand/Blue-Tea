import CommentForm from './commentForm'
import styles from "./productComments.module.css"
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import Link from 'next/link';
export default function ProductComments({ productID, comments, nextCursor, limit }) {
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
                    {nextCursor && (
                        <div className="mt-4 text-center">
                            <Link
                                className='classic'
                                href={`/products/${productID}?cursor=${nextCursor}&limit=${limit}`}>
                                Load more
                            </Link>
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
