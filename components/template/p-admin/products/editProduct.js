"use client"
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { productSchema } from '@/validators/product';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { usePut } from '@/utils/hooks/useReactQueryPanel';
import swal from '@/components/modules/swal'

export default function EditProduct({ data, tree }) {
    const router = useRouter()
    const fileInputRef = React.useRef(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            price: "",
            shortDescription: "",
            longDescription: "",
            img: null,
            tags: "",
            category: "",
            isAvailable: false,
            size: ""
        },
    })


    // fill form with data
    useEffect(() => {
        if (!data) return
        setValue("name", data.name)
        setValue("price", data.price)
        setValue("shortDescription", data.shortDescription)
        setValue("longDescription", data.longDescription)
        setValue("tags", data.tags)
        setValue("category", data.category)
        setValue("size", data.size)
        setValue("isAvailable", data.isAvailable)

    }, [data, setValue])

    const { mutate } = usePut("/products", {
        onSuccess: () => {
            toast.success("Product Updated Successfully :)");
            router.push("/p-admin/products");
        },
        onError: () => toast.error("Error updating product"),
    });

    const onSubmit = (values) => {
        swal({
            title: "Are You Sure To Edit This item?",
            icon: "warning",
            buttons: ["No", "Yes"],
        }).then((result) => {
            if (!result) return;

            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("price", values.price);
            formData.append("shortDescription", values.shortDescription);
            formData.append("longDescription", values.longDescription);
            formData.append("variants", values.variants);
            formData.append("tags", values.tags);
            formData.append("category", values.category);
            formData.append("isAvailable", values.isAvailable);

            if (fileInputRef.current?.files?.[0]) {
                formData.append("img", fileInputRef.current.files[0]);
            }

            mutate({ id: data._id, payload: formData });
        });
    };

    return (
        <form className="panel-form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate>
            <div className="col-span-12 md:col-span-6">
                <label htmlFor="editProduct-name" className="field-label">Product Name</label>
                <input id="editProduct-name"
                    type="text"
                    {...register("name")}
                    className="field"
                    required
                />
            </div>

            <div className="col-span-12 md:col-span-6">
                <label htmlFor="editProduct-price" className="field-label">Price</label>
                <input id="editProduct-price"
                    type="number"
                    {...register("price")}
                    className="field"
                    required
                />
            </div>

            <div className="col-span-12">
                <label htmlFor="editProduct-shortDescription" className="field-label">Short Description</label>
                <input id="editProduct-shortDescription"
                    type="text"
                    {...register("shortDescription")}
                    className="field"
                    required
                />
            </div>

            <div className="col-span-12">
                <label htmlFor="editProduct-longDescription" className="field-label">Long Description</label>
                <textarea id="editProduct-longDescription"
                    rows="4"
                    {...register("longDescription")}
                    className="field"
                    required
                ></textarea>
            </div>

            <div className="col-span-12 md:col-span-6">
                <label className="field-label">Image</label>
                <input
                    ref={fileInputRef}
                    type="file"
                    className="field"
                />
            </div>

            <div className="col-span-12 md:col-span-6">
                <label htmlFor="editProduct-category" className="field-label">Category</label>
                <select id="editProduct-category"
                    {...register("category")}
                    className="field"
                    required>
                    <option value="" disabled>Select category</option>
                    {tree.map(cat =>
                        cat.slug === "shop" && cat.children.map(item => (
                            <option value={item._id} key={item._id}>{item.name}</option>
                        ))
                    )}
                </select>
            </div>

            <div className="col-span-12 md:col-span-6">
                <label htmlFor="editProduct-tags" className="field-label">Tags</label>
                <input id="editProduct-tags"
                    type="text"
                    {...register("tags")}
                    className="field"
                    placeholder="organic, herbal-tea, relaxing, healthy"
                />
            </div>

            <div className="col-span-12 md:col-span-6">
                <label htmlFor="editProduct-size" className="field-label">Variants</label>
                <input id="editProduct-size"
                    type="text"
                    {...register("size")}
                    className="field"
                    placeholder="100g, 250g, 500g"
                />
            </div>

            <div className="flex items-center col-span-2">
                <input
                    type="checkbox"
                    {...register("isAvailable")} />
                <span>Available</span>
            </div>

            <div className="flex gap-2 mt-12 justify-end col-span-12">
                <button type="reset" className="btn-ghost">Reset</button>
                <button type='submit' className="classic">Save changes</button>
            </div>
        </form>
    )
}
