"use client"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentValidationSchema, type CommentInput } from '@/validators/comment';
import type { ID } from '@/types/models';

export default function CommentForm({ productID }: { productID: ID }) {
    const { register, handleSubmit, formState: { errors } } = useForm<CommentInput>({
        resolver: zodResolver(commentValidationSchema),
    })

    const onSubmit = (data: CommentInput) => {
        // TODO: send-review request (removed for now), payload: { ...data, product: productID }. On success: toast + reset()
        void data
        void productID
    };
    const err = (name: keyof CommentInput) => errors[name] && <p className="mt-1 mb-0 text-sm text-berry" role="alert">{errors[name]?.message}</p>

    return (
        <div className="rounded-xl border border-solid border-line bg-surface p-6 lg:sticky lg:top-24 lg:self-start">
            <h3 className="mb-5 text-xl font-semibold text-fg">Write a review</h3>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
                <div>
                    <label htmlFor="reviewName" className="field-label">Name</label>
                    <input type="text" {...register("username")} className="field" id="reviewName" autoComplete="name" />
                    {err("username")}
                </div>
                <div>
                    <label htmlFor="reviewEmail" className="field-label">Email</label>
                    <input type="email" {...register("email")} className="field" id="reviewEmail" autoComplete="email" />
                    {err("email")}
                </div>
                <div>
                    <label htmlFor="reviewRating" className="field-label">Rating</label>
                    <select className="field" {...register("score", { valueAsNumber: true })} id="reviewRating" defaultValue={5}>
                        <option value="5">5 – Excellent</option>
                        <option value="4">4 – Good</option>
                        <option value="3">3 – Okay</option>
                        <option value="2">2 – Poor</option>
                        <option value="1">1 – Bad</option>
                    </select>
                    {err("score")}
                </div>
                <div>
                    <label htmlFor="reviewText" className="field-label">Your review</label>
                    <textarea {...register("body")} className="field" id="reviewText" rows={4}></textarea>
                    {err("body")}
                </div>
                <button type="submit"
                    className="btn-organic mt-1 h-11 border-transparent bg-brown px-6 text-sm font-medium !text-white">
                    Submit review
                </button>
            </form>
        </div>
    )
}
