"use client"
import React, { useEffect } from 'react'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./commentForm.module.css"
import { usePost } from '@/utils/hooks/useReactQueryPublic';
import toast from 'react-hot-toast';
import { commentValidationSchema } from '@/validators/comment';

export default function CommentForm({ productID }) {
    // React Hook Form setup
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(commentValidationSchema),
    })
    useEffect(() => {
        console.log(errors);
    }, [errors]);


    const { mutate, isLoading } = usePost('/comments', {
        onSuccess: () => {
            toast.success("Your Comment Sent Successfully :)")
            reset()
        }
    });

    const onSubmit = (data) => {
        const commentData = { ...data, productID }
        mutate(commentData);
    };
    return (
        <div className={styles.card_body}>
            <h5>Add Your Review</h5>
            <form
                className={styles.login_form}
                onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <label htmlFor="reviewName"
                        className=" text-white form-label">Name</label>
                    <input type="text"
                        {...register("username")}
                        className="form-control"
                        id="reviewName"
                        placeholder="Your name" />
                </div>
                <div className="mb-3">
                    <label htmlFor="reviewEmail"
                        className="text-white form-label">Email</label>
                    <input type="text"
                        {...register("email")}
                        className="form-control"
                        id="reviewEmail"
                        placeholder="Your Email" />
                </div>
                <div className="mb-3">
                    <label htmlFor="reviewRating" className="form-label text-white">Rating</label>
                    <select className="text-white form-select"
                        {...register("score", { valueAsNumber: true })}
                        id="reviewRating">
                        <option value="5">★★★★★</option>
                        <option value="4">★★★★☆</option>
                        <option value="3">★★★☆☆</option>
                        <option value="2">★★☆☆☆</option>
                        <option value="1">★☆☆☆☆</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="reviewText"
                        className="text-white form-label">Comment</label>
                    <textarea
                        {...register("body")} className="form-control"
                        id="reviewText"
                        rows="3"
                        placeholder="Write your review"></textarea>
                </div>
                <button
                    type='submit'
                    disabled={isLoading}
                    className={styles.btn}>
                    {isLoading ? "Loading..." : "  Submit Review"}
                </button>
            </form>
        </div>

    )
}
