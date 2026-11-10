"use client"
import { useRef, useState, type FormEvent } from 'react'
import type { FieldErrors } from '@/types/api';
import type { Article } from '@/types/models';
import RichEditor from './RichEditor';

export default function AddNewArticle({ article }: { article?: Article | null }) {
    const formRef = useRef<HTMLFormElement>(null);
    const [content, setContent] = useState(article?.content || "");
    // field errors from the backend: { title: "Too short" }
    const [errors] = useState<FieldErrors>({});

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // the clicked button (Save Draft / Publish) adds its status=... to the form data
        const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
        const formData = new FormData(e.currentTarget, submitter);
        if (article?._id) formData.set("_id", article._id);
        formData.set("content", content);
        // TODO: save-article request (removed for now): POST /articles with formData.
        // On success: toast + formRef.current?.reset(). On error: show the backend's field errors.
    }

    return (
        <form
            ref={formRef}
            onSubmit={handleSubmit}
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
                {errors.title && (
                    <span className="text-sm text-berry">{errors.title}</span>
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
                {errors.author && (
                    <span className="text-sm text-berry">{errors.author}</span>
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
                {errors.shortDescription && (
                    <span className="text-sm text-berry">{errors.shortDescription}</span>
                )}
            </div>

            <div className="col-span-12">
                <RichEditor value={content}
                    onChange={setContent} />
                <input type="hidden" name="content"
                    value={content} />
                {errors.content && (
                    <span className="text-sm text-berry">{errors.content}</span>
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
                >
                    Save Draft
                </button>
                <button
                    type="submit"
                    name="status"
                    value="publish"
                    className="classic"
                >
                    Publish
                </button>
            </div>
        </form>
    )
}
