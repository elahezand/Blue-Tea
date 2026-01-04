"use client"
import { NewArticle } from '@/utils/actions/articleServerAction';
import React, { useState, useEffect, useRef } from 'react'
import { useActionState } from "react";
import toast from 'react-hot-toast';
import RichEditor from './RichEditor';

export default function AddNewArticle({ article }) {
    const formRef = useRef(null);
    const [content, setContent] = useState(article?.content || "");
 
    const [state, formAction, isPending] = useActionState(NewArticle, {
        status: null,
        message: null,
        fields: {
            title: article?.title || "",
            author: article?.author || "",
            shortDescription: article?.shortDescription || "",
            content: article?.content || "",
            cover: article?.cover || null,
        }
    });

    useEffect(() => {
        if (state?.status === 201 || state.status === 200) {
            toast.success("article added Successfully :)")
            formRef.current?.reset();
        }
    }, [state]);

    const handleSubmit = async (formData) => {
        if (article?._id) formData.set("_id", article._id);
        formData.set("content", content);
        await formAction(formData);
    }

    return (
        <form
            ref={formRef}
            action={handleSubmit}
            className="row g-3" >
            <div className="col-md-6">
                <label className="form-label">Title</label>
                <input
                    type="text"
                    name="title"
                    defaultValue={article?.title}
                    className="form-control"
                    required
                />
                {state?.errors?.title && (
                    <span className="text-sm text-red-500">{state.errors.title[0]}</span>
                )}
            </div>

            <div className="col-md-6">
                <label className="form-label">Author</label>
                <input
                    name="author"
                    type="text"
                    defaultValue={article?.author}
                    className="form-control"
                    required
                />
                {state?.errors?.author && (
                    <span className="text-sm text-red-500">{state.errors.author[0]}</span>
                )}
            </div>

            <div className="col-12">
                <label className="form-label">Short Description</label>
                <input
                    type="text"
                    name="shortDescription"
                    defaultValue={article?.shortDescription}
                    className="form-control"
                    required
                />
                {state?.errors?.shortDescription && (
                    <span className="text-sm text-red-500">{state.errors.shortDescription[0]}</span>
                )}
            </div>

            <div className="col-12">
                <RichEditor value={content}
                    onChange={setContent} />
                <input type="hidden" name="content"
                    value={content} />
                {state?.errors?.content && (
                    <span className="text-sm text-red-500">{state.errors.content[0]}</span>
                )}
            </div>
            <div className="col-md-6">
                <label className="form-label">Cover Image</label>
                <input
                    type="file"
                    name="cover"
                    className="form-control"
                />
            </div>
            <div className="col-12 d-flex gap-2 mt-4 justify-content-end">
                <button type="submit"
                    name="status"
                    value="unpublish"
                    className="classic"
                    disabled={isPending}
                >
                    {isPending ? "Saving..." : "Save Draft"}
                </button>
                <button
                    type="submit"
                    name="status"
                    value="publish"
                    className="edit"
                    disabled={isPending} >
                    {isPending ? "Publishing..." : "Publish"}
                </button>
            </div>
        </form>
    )
}
