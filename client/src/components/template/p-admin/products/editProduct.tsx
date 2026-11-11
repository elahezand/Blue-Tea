"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import swal from '@/components/modules/swal'
import Loader from '@/components/feedBack/Loader'
import { editProductSchema, type EditProductInput, type EditProductOutput } from '@/validators/product'
import { useGetProduct, useUpdateProduct } from '@/services/product.service'
import { useGetAdminCategories } from '@/services/category.service'
import { ROUTES } from '@/utils/constant'
import type { Product } from '@/types/models'

const EMPTY: EditProductInput = {
    name: "",
    price: "",
    shortDescription: "",
    longDescription: "",
    tags: "",
    variants: "",
    category: "",
    isAvailable: false,
}

const toForm = (product?: Product): EditProductInput => product ? {
    name: product.name,
    price: product.price,
    shortDescription: product.shortDescription,
    longDescription: product.longDescription,
    tags: (product.tags || []).join(", "),
    variants: (product.variants || []).join(", "),
    category: typeof product.category === "string" ? product.category : product.category?._id ?? "",
    isAvailable: !!product.isAvailable,
} : EMPTY

export default function EditProduct({ id }: { id: string }) {
    const router = useRouter()
    const [img, setImg] = useState<File | null>(null)

    const { data: product, isLoading, isError } = useGetProduct(id)
    const { data: categoriesData } = useGetAdminCategories({ limit: 100 })
    const categories = categoriesData?.items ?? []

    const { mutate: updateProduct, isPending } = useUpdateProduct(() => router.push(`${ROUTES.ADMIN}/products`))

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<EditProductInput, unknown, EditProductOutput>({
        resolver: zodResolver(editProductSchema),
        defaultValues: EMPTY,
    })

    useEffect(() => {
        if (product) reset(toForm(product))
    }, [product, reset])

    const onSubmit = (values: EditProductOutput) => {
        swal({
            title: "Are You Sure To Edit This item?",
            icon: "warning",
            buttons: ["No", "Yes"],
        }).then((result) => {
            if (!result) return

            const formData = new FormData()
            formData.append("name", values.name)
            formData.append("price", String(values.price))
            formData.append("shortDescription", values.shortDescription)
            formData.append("longDescription", values.longDescription)
            formData.append("variants", values.variants ?? "")
            formData.append("tags", values.tags ?? "")
            formData.append("category", values.category)
            formData.append("isAvailable", String(!!values.isAvailable))
            if (img) formData.append("img", img)

            updateProduct({ id, payload: formData })
        })
    }

    if (isLoading) return <Loader inline label="Loading product" />
    if (isError || !product) return <p className="text-sm text-berry">Couldn&apos;t load this product.</p>

    return (
        <form className="panel-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="col-span-12 md:col-span-6">
                <label htmlFor="editProduct-name" className="field-label">Product Name</label>
                <input id="editProduct-name" type="text" {...register("name")} className="field" />
                {errors.name && <span className="text-sm text-berry">{errors.name.message}</span>}
            </div>

            <div className="col-span-12 md:col-span-6">
                <label htmlFor="editProduct-price" className="field-label">Price</label>
                <input id="editProduct-price" type="number" {...register("price")} className="field" />
                {errors.price && <span className="text-sm text-berry">{errors.price.message}</span>}
            </div>

            <div className="col-span-12">
                <label htmlFor="editProduct-shortDescription" className="field-label">Short Description</label>
                <input id="editProduct-shortDescription" type="text" {...register("shortDescription")} className="field" />
                {errors.shortDescription && <span className="text-sm text-berry">{errors.shortDescription.message}</span>}
            </div>

            <div className="col-span-12">
                <label htmlFor="editProduct-longDescription" className="field-label">Long Description</label>
                <textarea id="editProduct-longDescription" rows={4} {...register("longDescription")} className="field" />
                {errors.longDescription && <span className="text-sm text-berry">{errors.longDescription.message}</span>}
            </div>

            <div className="col-span-12 md:col-span-6">
                <label htmlFor="editProduct-img" className="field-label">Image</label>
                <input id="editProduct-img" type="file" accept="image/*" onChange={(e) => setImg(e.target.files?.[0] ?? null)} className="field" />
            </div>

            <div className="col-span-12 md:col-span-6">
                <label htmlFor="editProduct-category" className="field-label">Category</label>
                <select id="editProduct-category" {...register("category")} className="field">
                    <option value="" disabled>Select category</option>
                    {categories.map((item) => (
                        <option value={item._id} key={item._id}>{item.name}</option>
                    ))}
                </select>
                {errors.category && <span className="text-sm text-berry">{errors.category.message}</span>}
            </div>

            <div className="col-span-12 md:col-span-6">
                <label htmlFor="editProduct-tags" className="field-label">Tags</label>
                <input id="editProduct-tags" type="text" {...register("tags")} className="field" placeholder="organic, herbal-tea, relaxing, healthy" />
            </div>

            <div className="col-span-12 md:col-span-6">
                <label htmlFor="editProduct-variants" className="field-label">Variants</label>
                <input id="editProduct-variants" type="text" {...register("variants")} className="field" placeholder="100g, 250g, 500g" />
            </div>

            <label className="col-span-12 flex cursor-pointer items-center gap-2 text-sm text-fg">
                <input type="checkbox" {...register("isAvailable")} className="size-4 accent-[var(--accent)]" />
                Available for sale
            </label>

            <div className="flex gap-2 mt-12 justify-end col-span-12">
                <button type="button" onClick={() => reset(toForm(product))} className="btn-ghost">Reset</button>
                <button type="submit" disabled={isPending} className="classic disabled:opacity-60">
                    {isPending ? "Saving..." : "Save changes"}
                </button>
            </div>
        </form>
    )
}