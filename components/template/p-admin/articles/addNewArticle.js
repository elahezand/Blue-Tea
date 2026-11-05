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
            className="panel-form" >
            <div className="col-span-12 md:col-span-6">
                <label htmlFor="addNewArticle-title" className="field-label">Title</label>
                <input id="addNewArticle-title"
                    type="text"
                    name="title"
                    defaultValue={article?.title}
                    className="field"
                    required
                />
                {state?.errors?.title && (
                    <span className="text-sm text-berry">{state.errors.title[0]}</span>
                )}
            </div>

            <div className="col-span-12 md:col-span-6">
                <label htmlFor="addNewArticle-author" className="field-label">Author</label>
                <input id="addNewArticle-author"
                    name="author"
                    type="text"
                    defaultValue={article?.author}
                    className="field"
                    required
                />
                {state?.errors?.author && (
                    <span className="text-sm text-berry">{state.errors.author[0]}</span>
                )}
            </div>

            <div className="col-span-12">
                <label htmlFor="addNewArticle-shortDescription" className="field-label">Short Description</label>
                <input id="addNewArticle-shortDescription"
                    type="text"
                    name="shortDescription"
                    defaultValue={article?.shortDescription}
                    className="field"
                    required
                />
                {state?.errors?.shortDescription && (
                    <span className="text-sm text-berry">{state.errors.shortDescription[0]}</span>
                )}
            </div>

            <div className="col-span-12">
                <RichEditor value={content}
                    onChange={setContent} />
                <input type="hidden" name="content"
                    value={content} />
                {state?.errors?.content && (
                    <span className="text-sm text-berry">{state.errors.content[0]}</span>
                )}
            </div>
            <div className="col-span-12 md:col-span-6">
                <label htmlFor="addNewArticle-cover" className="field-label">Cover Image</label>
                <input id="addNewArticle-cover"
                    type="file"
                    name="cover"
                    className="field"
                />
            </div>
            <div className="flex gap-2 mt-6 justify-end col-span-12">
                <button type="submit"
                    name="status"
                    value="unpublish"
                    className="btn-ghost"
                    disabled={isPending}
                >
                    {isPending ? "Saving..." : "Save Draft"}
                </button>
                <button
                    type="submit"
                    name="status"
                    value="publish"
                    className="classic"
                    disabled={isPending} >
                    {isPending ? "Publishing..." : "Publish"}
                </button>
            </div>
        </form>
    )
}
