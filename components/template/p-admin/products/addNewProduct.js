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
                className="row g-3">
                <div className="col-md-6">
                    <label className="form-label">Product Name</label>
                    <input type="text"
                        name='name'
                        className="form-control"
                        required />
                    {state?.errors?.name && (
                        <span className="text-sm text-red-500">{state.errors.name[0]}</span>
                    )}
                </div>

                <div className="col-md-6">
                    <label className="form-label">Price</label>
                    <input
                        name='price'
                        type="number"
                        className="form-control" required />
                    {state?.errors?.price && (
                        <span className="text-sm text-red-500">{state.errors.price[0]}</span>
                    )}
                </div>

                <div className="col-12">
                    <label className="form-label">Short Description</label>
                    <input type="text"
                        name='shortDescription'
                        className="form-control" required />
                    {state?.errors?.shortDescription && (
                        <span className="text-sm text-red-500">{state.errors.shortDescription[0]}</span>
                    )}
                </div>

                <div className="col-12">
                    <label className="form-label">Long Description</label>
                    <textarea rows="4"
                        name='longDescription'
                        className="form-control" required></textarea>
                    {state?.errors?.longDescription && (
                        <span className="text-sm text-red-500">{state.errors.longDescription[0]}</span>
                    )}
                </div>

                <div className="col-md-6">
                    <label className="form-label">Image URL</label>
                    <input type="file"
                        accept="image/*"
                        name='img'
                        className="form-control" />
                </div>

                <div className="col-md-6">
                    <label className="form-label">Category</label>
                    <select className="form-select" name='category' defaultValue="-1" required>
                        <option value="-1" disabled>Select category</option>
                        {categories.length > 0 && categories.map((item) => (
                            <option value={item._id} key={item._id.toString()}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                    {state?.errors?.category && (
                        <span className="text-sm text-red-500">{state.errors.category[0]}</span>
                    )}
                </div>
                <div className="col-md-6">
                    <label className="form-label">Tags</label>
                    <input type="text"
                        name='tags'
                        className="form-control"
                        placeholder="organic, herbal-tea, relaxing, healthy" />
                    {state?.errors?.tags && (
                        <span className="text-sm text-red-500">{state.errors.tags[0]}</span>
                    )}
                </div>
                <div className="col-md-6">
                    <label className="form-label">Variants</label>
                    <input type="text"
                        name='variants'
                        className="form-control"
                        placeholder="100g, 250g, 500g" />
                    {state?.errors?.variants && (
                        <span className="text-sm text-red-500">{state.errors.variants[0]}</span>
                    )}
                </div>
                <div className="d-flex align-items-center
             gap-1" style={{ width: "50px" }}>
                    <input type="checkbox"
                        name='isAvailable' />
                    <span>Available</span>
                </div>
                <div className="col-12 d-flex gap-2 mt-5 justify-content-end">
                    <button
                        type='submit'
                        className="edit" disabled={isPending}
                    >
                        {isPending ? "Creating..." : "Create"}
                    </button>
                    <button type="reset" className="remove">Reset</button>
                </div>
            </form>
        </>
    )
}
