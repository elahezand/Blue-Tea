"use client"
import React, { useEffect, useRef } from 'react'
import { NewMenuItem } from '@/utils/actions/menuItemServerAction';
import { useActionState } from "react";
import toast from 'react-hot-toast';
export default function AddnewMenuItem({ tree }) {
    const formRef = useRef(null);
    const [state, formAction] = useActionState(NewMenuItem, {
        status: null,
        message: null,
        fields: {
            name: "",
            price: "",
            description: "",
            size: "",
            category: "",
            image: "",
        }
    });

    useEffect(() => {
        if (state?.status === 201 || state.status === 200) {
            toast.success("menuItem added Successfully :)")
             formRef.current?.reset();
        }
    }, [state.status]);


    return (
        <div>
            <form
                ref={formRef}
                action={async (formData) => {
                    await formAction(formData);
                }}
                className="panel-form">
                <div className="col-span-12 md:col-span-6">
                    <label htmlFor="addnewMenuItem-name" className="field-label">Name</label>
                    <input id="addnewMenuItem-name" type="text"
                        name='name'
                        className="field"
                        required />
                    {state?.errors?.name && (
                        <span className="text-sm text-berry">{state.errors.name[0]}</span>
                    )}
                </div>

                <div className="col-span-12 md:col-span-6">
                    <label htmlFor="addnewMenuItem-price" className="field-label">Price</label>
                    <input id="addnewMenuItem-price" type="number"
                        name='price'
                        className="field" required />
                    {state?.errors?.price && (
                        <span className="text-sm text-berry">{state.errors.price[0]}</span>
                    )}
                </div>

                <div className="col-span-12">
                    <label htmlFor="addnewMenuItem-description" className="field-label">Description</label>
                    <input id="addnewMenuItem-description" type="text"
                        name="description"
                        lassName="form-control" required />
                    {state?.errors?.description && (
                        <span className="text-sm text-berry">{state.errors.description[0]}</span>
                    )}
                </div>

                <div className="col-span-12 md:col-span-6">
                    <label htmlFor="addnewMenuItem-category" className="field-label">Category</label>
                    <select id="addnewMenuItem-category"
                        className="field"
                        name='category'
                        required>
                        <option disabled>Select category</option>
                        {tree.map((cat, index) => (
                            cat.slug === "menu" &&
                            cat.children.map(item => (
                                <option
                                    value={item._id}
                                    key={item._id}>
                                    {item.name}</option>
                            ))
                        ))}
                    </select>
                    {state?.errors?.category && (
                        <span className="text-sm text-berry">{state.errors.category[0]}</span>
                    )}
                </div>
                <div className="col-span-12 md:col-span-6">
                    <label htmlFor="addnewMenuItem-image" className="field-label">Cover Image</label>
                    <input id="addnewMenuItem-image"
                        type="file"
                        name="image"
                        className="field"
                    />
                </div>
                <div className="col-span-12 md:col-span-6">
                    <label htmlFor="addnewMenuItem-size" className="field-label">Size</label>
                    <input id="addnewMenuItem-size" type="text"
                        name='size'
                        className="field"
                        placeholder="M,L,S" />
                    {state?.errors?.size && (
                        <span className="text-sm text-berry">{state.errors.size[0]}</span>
                    )}
                </div>
                <div className="flex gap-2 mt-12 justify-end col-span-12">
                    <button type="reset" className="btn-ghost">Reset</button>
                    <button type="submit" className="classic">Create item</button>
                </div>
            </form>
        </div>
    )
}
