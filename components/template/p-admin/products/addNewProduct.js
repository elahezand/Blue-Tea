"use client"
import React from 'react'
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from "react";
import { NewProduct } from '@/utils/actions/productActionServer';
import toast from 'react-hot-toast';

export default function AddNewProduct({ tree }) {
    const router = useRouter()
    const [state, formAction, isPending] = useActionState(NewProduct, {
        status: null,
        message: null,
        fields: {
            name: "",
            price: "",
            longDescription: "",
            shortDescription: "",
            isAvailable: "",
            score: "",
            variants: "",
            tags: "",
            category: "",
            img: ""
        }
    })

    useEffect(() => {
        if (state?.status === 201 || state.status === 200) {
            toast.success("Product added Successfully :)")
            router.replace("/p-admin/products")
        }
    }, [state,router])

    const categories = tree?.[0]?.children || [];

    return (
        <>
            <form
                action={formAction}
                className="panel-form">
                <div className="col-span-12 md:col-span-6">
                    <label htmlFor="addNewProduct-name" className="field-label">Product Name</label>
                    <input id="addNewProduct-name" type="text"
                        name='name'
                        className="field"
                        required />
                    {state?.errors?.name && (
                        <span className="text-sm text-berry">{state.errors.name[0]}</span>
                    )}
                </div>

                <div className="col-span-12 md:col-span-6">
                    <label htmlFor="addNewProduct-price" className="field-label">Price</label>
                    <input id="addNewProduct-price"
                        name='price'
                        type="number"
                        className="field" required />
                    {state?.errors?.price && (
                        <span className="text-sm text-berry">{state.errors.price[0]}</span>
                    )}
                </div>

                <div className="col-span-12">
                    <label htmlFor="addNewProduct-shortDescription" className="field-label">Short Description</label>
                    <input id="addNewProduct-shortDescription" type="text"
                        name='shortDescription'
                        className="field" required />
                    {state?.errors?.shortDescription && (
                        <span className="text-sm text-berry">{state.errors.shortDescription[0]}</span>
                    )}
                </div>

                <div className="col-span-12">
                    <label htmlFor="addNewProduct-longDescription" className="field-label">Long Description</label>
                    <textarea id="addNewProduct-longDescription" rows="4"
                        name='longDescription'
                        className="field" required></textarea>
                    {state?.errors?.longDescription && (
                        <span className="text-sm text-berry">{state.errors.longDescription[0]}</span>
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
                    {state?.errors?.category && (
                        <span className="text-sm text-berry">{state.errors.category[0]}</span>
                    )}
                </div>
                <div className="col-span-12 md:col-span-6">
                    <label htmlFor="addNewProduct-tags" className="field-label">Tags</label>
                    <input id="addNewProduct-tags" type="text"
                        name='tags'
                        className="field"
                        placeholder="organic, herbal-tea, relaxing, healthy" />
                    {state?.errors?.tags && (
                        <span className="text-sm text-berry">{state.errors.tags[0]}</span>
                    )}
                </div>
                <div className="col-span-12 md:col-span-6">
                    <label htmlFor="addNewProduct-variants" className="field-label">Variants</label>
                    <input id="addNewProduct-variants" type="text"
                        name='variants'
                        className="field"
                        placeholder="100g, 250g, 500g" />
                    {state?.errors?.variants && (
                        <span className="text-sm text-berry">{state.errors.variants[0]}</span>
                    )}
                </div>
                <label className="col-span-12 flex cursor-pointer items-center gap-2 text-sm text-fg"><input type="checkbox" name='isAvailable' className="size-4 accent-[var(--accent)]" />Available for sale</label>
                <div className="flex gap-2 mt-12 justify-end col-span-12">
                    <button type="reset" className="btn-ghost">Reset</button>
                    <button
                        type='submit'
                        className="classic" disabled={isPending}
                    >
                        {isPending ? "Creating..." : "Create"}
                    </button>
                </div>
            </form>
        </>
    )
}
