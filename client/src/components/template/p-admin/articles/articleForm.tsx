"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Loader from "@/components/feedback/loader"
import RichEditor from "./richEditor"
import { useDraftArticle, useGetAdminArticle, useUpdateArticle } from "@/services/article.service"
import { articleSchema, type ArticleInput } from "@/validators/article"
import { applyFieldErrors } from "@/utils/apiError"
import { ROUTES } from "@/utils/constant"
import type { ArticleStatus } from "@/types/article"
import type { ID } from "@/types/api"

const EMPTY: ArticleInput = { title: "", author: "", shortDescription: "", content: "" }

export default function ArticleForm({ id }: { id?: ID | null }) {
    const router = useRouter()
    const [cover, setCover] = useState<File | null>(null)
    const { data: article, isLoading } = useGetAdminArticle(id)
    const backToList = () => router.push(`${ROUTES.ADMIN}/articles`)
    const { mutate: createArticle, isPending: creating } = useDraftArticle(backToList)
    const { mutate: updateArticle, isPending: updating } = useUpdateArticle(backToList)
    const saving = creating || updating

    const { register, control, handleSubmit, reset, setError, formState: { errors } } = useForm<ArticleInput>({
        resolver: zodResolver(articleSchema),
        defaultValues: EMPTY,
    })

    useEffect(() => {
        if (article) reset({ title: article.title, author: article.author, shortDescription: article.shortDescription, content: article.content })
    }, [article, reset])

    const save = (status: ArticleStatus) => handleSubmit((values) => {
        const formData = new FormData()
        Object.entries(values).forEach(([key, value]) => formData.append(key, value))
        formData.append("status", status)
        if (cover) formData.append("cover", cover)
        const onError = (error: unknown) => applyFieldErrors(error, setError)
        if (id) updateArticle({ id, payload: formData }, { onError })
        else createArticle(formData, { onError })
    })

    if (id && isLoading) return <Loader inline label="Loading the article" />

    return (
        <form className="panel-form" noValidate onSubmit={(e) => e.preventDefault()}>
            <div className="col-span-12 md:col-span-6">
                <label htmlFor="article-title" className="field-label">Title</label>
                <input id="article-title" type="text" {...register("title")} className="field" />
                {errors.title && <span className="text-sm text-berry">{errors.title.message}</span>}
            </div>

            <div className="col-span-12 md:col-span-6">
                <label htmlFor="article-author" className="field-label">Author</label>
                <input id="article-author" type="text" {...register("author")} className="field" />
                {errors.author && <span className="text-sm text-berry">{errors.author.message}</span>}
            </div>

            <div className="col-span-12">
                <label htmlFor="article-shortDescription" className="field-label">Short Description</label>
                <input id="article-shortDescription" type="text" {...register("shortDescription")} className="field" />
                {errors.shortDescription && <span className="text-sm text-berry">{errors.shortDescription.message}</span>}
            </div>

            <div className="col-span-12">
                <Controller name="content" control={control} render={({ field }) => (
                    <RichEditor value={field.value} onChange={field.onChange} />
                )} />
                {errors.content && <span className="text-sm text-berry">{errors.content.message}</span>}
            </div>

            <div className="col-span-12 md:col-span-6">
                <label htmlFor="article-cover" className="field-label">Cover Image</label>
                <input id="article-cover" type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] ?? null)} className="field" />
            </div>

            <div className="col-span-12 mt-6 flex justify-end gap-2">
                <button type="button" onClick={save("unpublish")} disabled={saving} className="btn-ghost">Save Draft</button>
                <button type="button" onClick={save("publish")} disabled={saving} className="classic disabled:opacity-60">
                    {saving ? "Saving..." : "Publish"}
                </button>
            </div>
        </form>
    )
}
