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
        <form className="row g-3"
            onSubmit={handleSubmit(onSubmit)}
            noValidate>
            <div className="col-md-6">
                <label className="form-label">Title</label>
                <input
                    type="text"
                    className="form-control"
                    {...register("title")}
                    required
                />
            </div>
            <div className="col-md-6">
                <label className="form-label">Author</label>
                <input
                    type="text"
                    className="form-control"
                    {...register("author")}
                    required
                />
            </div>
            <div className="col-12">
                <label className="form-label">Short Description</label>
                <input
                    type="text"
                    className="form-control"
                    {...register("shortDescription")}
                    required
                />
            </div>
            <RichEditor
                value={data.content || ""} onChange={(val) =>
                 setValue("content", val)}
            />
            <div className="col-md-6">
                <label className="form-label">Cover Image URL</label>
                <input
                    type="file"
                    className="form-control"
                    ref={fileInputRef}
                    placeholder="https://example.com/image.jpg"
                />
            </div>

            <div className="col-12 d-flex justify-content-end mt-4">
                <button
                    type='submit'
                    className="edit">
                    Edit
                </button>
            </div>
        </form>
    )
}
