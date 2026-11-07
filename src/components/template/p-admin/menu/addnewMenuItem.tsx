"use client"
import { useRef, useState, type FormEvent } from 'react'
import type { FieldErrors } from '@/types/api';
import type { CategoryNode } from '@/types/models';

export default function AddnewMenuItem({ tree }: { tree: CategoryNode[] }) {
    const formRef = useRef<HTMLFormElement>(null);
    // field errors from the backend: { name: "Too short" }
    const [errors] = useState<FieldErrors>({});

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        // TODO: create-menu-item request (removed for now): POST /menu with formData.
        // On success: toast + formRef.current?.reset(). On error: show the backend's field errors.
        void formData
    };


    return (
        <div>
            <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="panel-form">
                <div className="col-span-12 md:col-span-6">
                    <label htmlFor="addnewMenuItem-name" className="field-label">Name</label>
                    <input id="addnewMenuItem-name" type="text"
                        name='name'
                        className="field"
                        required />
                    {errors.name && (
                        <span className="text-sm text-berry">{errors.name}</span>
                    )}
                </div>

                <div className="col-span-12 md:col-span-6">
                    <label htmlFor="addnewMenuItem-price" className="field-label">Price</label>
                    <input id="addnewMenuItem-price" type="number"
                        name='price'
                        className="field" required />
                    {errors.price && (
                        <span className="text-sm text-berry">{errors.price}</span>
                    )}
                </div>

                <div className="col-span-12">
                    <label htmlFor="addnewMenuItem-description" className="field-label">Description</label>
                    <input id="addnewMenuItem-description" type="text"
                        name="description"
                        className="field" required />
                    {errors.description && (
                        <span className="text-sm text-berry">{errors.description}</span>
                    )}
                </div>

                <div className="col-span-12 md:col-span-6">
                    <label htmlFor="addnewMenuItem-category" className="field-label">Category</label>
                    <select id="addnewMenuItem-category"
                        className="field"
                        name='category'
                        required>
                        <option disabled>Select category</option>
                        {tree.map((cat) => (
                            cat.slug === "menu" &&
                            cat.children.map(item => (
                                <option
                                    value={item._id}
                                    key={item._id}>
                                    {item.name}</option>
                            ))
                        ))}
                    </select>
                    {errors.category && (
                        <span className="text-sm text-berry">{errors.category}</span>
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
                    {errors.size && (
                        <span className="text-sm text-berry">{errors.size}</span>
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
