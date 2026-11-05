"use client"
import React from 'react'
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePut } from '@/utils/hooks/useReactQueryPanel';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import RichEditor from './RichEditor';
import { articleSchema } from '@/validators/article';
import swal from '@/components/modules/swal'
export default function EditArticle({ data }) {
    const router = useRouter()
    const fileInputRef = React.useRef(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(articleSchema),
        defaultValues: {
            title: "",
            author: "",
            shortDescription: "",
            content: "",
            cover: null,
        },
    })

    // fill form with data
    useEffect(() => {
        if (!data) return
        setValue("title", data.title)
        setValue("author", data.author)
        setValue("shortDescription", data.shortDescription)
        setValue("content", data.content)
    }, [data, setValue])

    // PUT article
    const { mutate } = usePut("/articles", {
        onSuccess: () => {
            toast.success("article Editted Successfully :)")
            router.replace("/p-admin/articles")
        },
    });

    const onSubmit = (values) => {

        swal({
            title: "Are You Sure To Edit This item?",
            icon: "warning",
            buttons: ["No", "Yes"],
        }).then((result) => {
            if (!result) return;

            const formData = new FormData();
            const id = data._id
            formData.append("_id", id);
            formData.append("title", values.title);
            formData.append("author", values.author);
            formData.append("shortDescription", values.shortDescription);
            formData.append("content", values.content);

            if (fileInputRef.current?.files?.[0]) {
                formData.append("cover", fileInputRef.current.files[0]);
            }

            mutate({ id: id, payload: formData });
        });
    };
    return (
        <form className="panel-form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate>
            <div className="col-span-12 md:col-span-6">
                <label htmlFor="editArticle-title" className="field-label">Title</label>
                <input id="editArticle-title"
                    type="text"
                    className="field"
                    {...register("title")}
                    required
                />
            </div>
            <div className="col-span-12 md:col-span-6">
                <label htmlFor="editArticle-author" className="field-label">Author</label>
                <input id="editArticle-author"
                    type="text"
                    className="field"
                    {...register("author")}
                    required
                />
            </div>
            <div className="col-span-12">
                <label htmlFor="editArticle-shortDescription" className="field-label">Short Description</label>
                <input id="editArticle-shortDescription"
                    type="text"
                    className="field"
                    {...register("shortDescription")}
                    required
                />
            </div>
            <RichEditor
                value={data.content || ""} onChange={(val) =>
                 setValue("content", val)}
            />
            <div className="col-span-12 md:col-span-6">
                <label className="field-label">Cover Image URL</label>
                <input
                    type="file"
                    className="field"
                    ref={fileInputRef}
                    placeholder="https://example.com/image.jpg"
                />
            </div>

            <div className="flex justify-end mt-6 col-span-12">
                <button
                    type='submit'
                    className="classic">
                    Save changes
                </button>
            </div>
        </form>
    )
}
