"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createProductSchema, type CreateProductInput, type CreateProductOutput } from "@/validators/product"
import { useCreateProduct } from "@/services/product.service"
import { useGetAdminCategories } from "@/services/category.service"

const EMPTY: CreateProductInput = {
    name: "",
    price: "",
    shortDescription: "",
    longDescription: "",
    tags: "",
    variants: "",
    category: "",
    isAvailable: false,
}

export default function AddNewProduct() {
    const [img, setImg] = useState<File | null>(null)
    const [fileKey, setFileKey] = useState(0)
    const { data } = useGetAdminCategories({ limit: 100 })
    const categories = data?.items ?? []

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateProductInput, unknown, CreateProductOutput>({
        resolver: zodResolver(createProductSchema),
        defaultValues: EMPTY,
    })

    const clearForm = () => {
        reset(EMPTY)
        setImg(null)
        setFileKey((k) => k + 1)
    }

    const { mutate: createProduct, isPending } = useCreateProduct(clearForm)

    const onSubmit = (values: CreateProductOutput) => {
        const formData = new FormData()
        formData.append("name", values.name)
        formData.append("price", String(values.price))
        formData.append("shortDescription", values.shortDescription)
        formData.append("longDescription", values.longDescription)
        formData.append("tags", values.tags ?? "")
        formData.append("variants", values.variants ?? "")
        formData.append("category", values.category)
        formData.append("isAvailable", String(!!values.isAvailable))
        if (img) formData.append("img", img)
        createProduct(formData)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="panel-form">
            <div className="col-span-12 md:col-span-6">
                <label htmlFor="addNewProduct-name" className="field-label">Product Name</label>
                <input id="addNewProduct-name" type="text" {...register("name")} className="field" />
                {errors.name && <span className="text-sm text-berry">{errors.name.message}</span>}
            </div>

            <div className="col-span-12 md:col-span-6">
                <label htmlFor="addNewProduct-price" className="field-label">Price</label>
                <input id="addNewProduct-price" type="number" {...register("price")} className="field" />
                {errors.price && <span className="text-sm text-berry">{errors.price.message}</span>}
            </div>

            <div className="col-span-12">
                <label htmlFor="addNewProduct-shortDescription" className="field-label">Short Description</label>
                <input id="addNewProduct-shortDescription" type="text" {...register("shortDescription")} className="field" />
                {errors.shortDescription && <span className="text-sm text-berry">{errors.shortDescription.message}</span>}
            </div>

            <div className="col-span-12">
                <label htmlFor="addNewProduct-longDescription" className="field-label">Long Description</label>
                <textarea id="addNewProduct-longDescription" rows={4} {...register("longDescription")} className="field" />
                {errors.longDescription && <span className="text-sm text-berry">{errors.longDescription.message}</span>}
            </div>

            <div className="col-span-12 md:col-span-6">
                <label htmlFor="addNewProduct-img" className="field-label">Product image</label>
                <input key={fileKey} id="addNewProduct-img" type="file" accept="image/*" onChange={(e) => setImg(e.target.files?.[0] ?? null)} className="field" />
            </div>

            <div className="col-span-12 md:col-span-6">
                <label htmlFor="addNewProduct-category" className="field-label">Category</label>
                <select id="addNewProduct-category" {...register("category")} className="field">
                    <option value="" disabled>Select category</option>
                    {categories.map((item) => (
                        <option value={item._id} key={item._id}>{item.name}</option>
                    ))}
                </select>
                {errors.category && <span className="text-sm text-berry">{errors.category.message}</span>}
            </div>

            <div className="col-span-12 md:col-span-6">
                <label htmlFor="addNewProduct-tags" className="field-label">Tags</label>
                <input id="addNewProduct-tags" type="text" {...register("tags")} className="field" placeholder="organic, herbal-tea, relaxing, healthy" />
            </div>

            <div className="col-span-12 md:col-span-6">
                <label htmlFor="addNewProduct-variants" className="field-label">Variants</label>
                <input id="addNewProduct-variants" type="text" {...register("variants")} className="field" placeholder="100g, 250g, 500g" />
            </div>

            <label className="col-span-12 flex cursor-pointer items-center gap-2 text-sm text-fg">
                <input type="checkbox" {...register("isAvailable")} className="size-4 accent-[var(--accent)]" />
                Available for sale
            </label>

            <div className="flex gap-2 mt-12 justify-end col-span-12">
                <button type="button" onClick={clearForm} className="btn-ghost">Reset</button>
                <button type="submit" disabled={isPending} className="classic disabled:opacity-60">
                    {isPending ? "Creating..." : "Create"}
                </button>
            </div>
        </form>
    )
}