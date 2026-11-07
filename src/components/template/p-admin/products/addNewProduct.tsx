"use client"
import { useState, type FormEvent } from "react";
import type { FieldErrors } from '@/types/api';
import type { ProductCategoryNode } from '@/types/models';

export default function AddNewProduct({ tree }: { tree: ProductCategoryNode[] }) {
    // field errors from the backend: { name: "Too short" }
    const [errors] = useState<FieldErrors>({})

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        // TODO: create-product request (removed for now): POST /products with formData.
        // On success: toast + router.replace("/p-admin/products"). On error: show the backend's field errors.
        void formData
    }

    const categories = tree?.[0]?.children || [];

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="panel-form">
                <div className="col-span-12 md:col-span-6">
                    <label htmlFor="addNewProduct-name" className="field-label">Product Name</label>
                    <input id="addNewProduct-name" type="text"
                        name='name'
                        className="field"
                        required />
                    {errors.name && (
                        <span className="text-sm text-berry">{errors.name}</span>
                    )}
                </div>

                <div className="col-span-12 md:col-span-6">
                    <label htmlFor="addNewProduct-price" className="field-label">Price</label>
                    <input id="addNewProduct-price"
                        name='price'
                        type="number"
                        className="field" required />
                    {errors.price && (
                        <span className="text-sm text-berry">{errors.price}</span>
                    )}
                </div>

                <div className="col-span-12">
                    <label htmlFor="addNewProduct-shortDescription" className="field-label">Short Description</label>
                    <input id="addNewProduct-shortDescription" type="text"
                        name='shortDescription'
                        className="field" required />
                    {errors.shortDescription && (
                        <span className="text-sm text-berry">{errors.shortDescription}</span>
                    )}
                </div>

                <div className="col-span-12">
                    <label htmlFor="addNewProduct-longDescription" className="field-label">Long Description</label>
                    <textarea id="addNewProduct-longDescription" rows={4}
                        name='longDescription'
                        className="field" required></textarea>
                    {errors.longDescription && (
                        <span className="text-sm text-berry">{errors.longDescription}</span>
                    )}
                </div>

                <div className="col-span-12 md:col-span-6">
                    <label htmlFor="addNewProduct-img" className="field-label">Product image</label>
                    <input id="addNewProduct-img" type="file"
                        accept="image/*"
                        name='img'
                        className="field" />
                </div>

                <div className="col-span-12 md:col-span-6">
                    <label htmlFor="addNewProduct-category" className="field-label">Category</label>
                    <select id="addNewProduct-category" className="field" name='category' defaultValue="-1" required>
                        <option value="-1" disabled>Select category</option>
                        {categories.length > 0 && categories.map((item) => (
                            <option value={item._id} key={item._id.toString()}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                    {errors.category && (
                        <span className="text-sm text-berry">{errors.category}</span>
                    )}
                </div>
                <div className="col-span-12 md:col-span-6">
                    <label htmlFor="addNewProduct-tags" className="field-label">Tags</label>
                    <input id="addNewProduct-tags" type="text"
                        name='tags'
                        className="field"
                        placeholder="organic, herbal-tea, relaxing, healthy" />
                    {errors.tags && (
                        <span className="text-sm text-berry">{errors.tags}</span>
                    )}
                </div>
                <div className="col-span-12 md:col-span-6">
                    <label htmlFor="addNewProduct-variants" className="field-label">Variants</label>
                    <input id="addNewProduct-variants" type="text"
                        name='variants'
                        className="field"
                        placeholder="100g, 250g, 500g" />
                    {errors.variants && (
                        <span className="text-sm text-berry">{errors.variants}</span>
                    )}
                </div>
                <label className="col-span-12 flex cursor-pointer items-center gap-2 text-sm text-fg"><input type="checkbox" name='isAvailable' className="size-4 accent-[var(--accent)]" />Available for sale</label>
                <div className="flex gap-2 mt-12 justify-end col-span-12">
                    <button type="reset" className="btn-ghost">Reset</button>
                    <button
                        type='submit'
                        className="classic"
                    >
                        Create
                    </button>
                </div>
            </form>
        </>
    )
}
