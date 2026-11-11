"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useGetAdminCategories } from "@/services/category.service"
import { menuItemSchema, type MenuItemInput, type MenuItemOutput } from "@/validators/menu"
import type { MenuItem } from "@/types/menu"

const EMPTY: MenuItemInput = { name: "", price: "", description: "", category: "", size: "" }

const toForm = (item?: MenuItem | null): MenuItemInput => item ? {
    name: item.name,
    price: item.price,
    description: item.description,
    category: typeof item.category === "string" ? item.category : item.category?._id ?? "",
    size: item.size ?? "",
} : EMPTY

interface MenuItemFormProps {
    item?: MenuItem | null
    isPending: boolean
    submitLabel: string
    onSave: (formData: FormData, done: () => void, setError: (field: keyof MenuItemInput, error: { type: string; message: string }) => void) => void
    onCancel?: () => void
}

export default function MenuItemForm({ item, isPending, submitLabel, onSave, onCancel }: MenuItemFormProps) {
    const [img, setImg] = useState<File | null>(null)
    const [fileKey, setFileKey] = useState(0)
    const { data } = useGetAdminCategories({ type: "menu" })
    const sections = data?.items ?? []

    const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<MenuItemInput, unknown, MenuItemOutput>({
        resolver: zodResolver(menuItemSchema),
        defaultValues: toForm(item),
    })

    const clear = () => {
        reset(toForm(item))
        setImg(null)
        setFileKey((k) => k + 1)
    }

    const onSubmit = (values: MenuItemOutput) => {
        const formData = new FormData()
        formData.append("name", values.name)
        formData.append("price", String(values.price))
        formData.append("description", values.description)
        formData.append("category", values.category)
        formData.append("size", values.size ?? "")
        if (img) formData.append("img", img)
        onSave(formData, clear, setError)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="panel-form">
            <div className="col-span-12 md:col-span-6">
                <label htmlFor="menu-name" className="field-label">Name</label>
                <input id="menu-name" type="text" {...register("name")} className="field" />
                {errors.name && <span className="text-sm text-berry">{errors.name.message}</span>}
            </div>

            <div className="col-span-12 md:col-span-6">
                <label htmlFor="menu-price" className="field-label">Price</label>
                <input id="menu-price" type="number" step="0.1" {...register("price")} className="field" />
                {errors.price && <span className="text-sm text-berry">{errors.price.message}</span>}
            </div>

            <div className="col-span-12">
                <label htmlFor="menu-description" className="field-label">Description</label>
                <textarea id="menu-description" rows={3} {...register("description")} className="field" />
                {errors.description && <span className="text-sm text-berry">{errors.description.message}</span>}
            </div>

            <div className="col-span-12 md:col-span-6">
                <label htmlFor="menu-category" className="field-label">Section</label>
                <select id="menu-category" {...register("category")} className="field">
                    <option value="" disabled>Select a section</option>
                    {sections.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
                {errors.category && <span className="text-sm text-berry">{errors.category.message}</span>}
            </div>

            <div className="col-span-12 md:col-span-6">
                <label htmlFor="menu-size" className="field-label">Size</label>
                <input id="menu-size" type="text" {...register("size")} className="field" placeholder="S, M, L" />
                {errors.size && <span className="text-sm text-berry">{errors.size.message}</span>}
            </div>

            <div className="col-span-12 md:col-span-6">
                <label htmlFor="menu-img" className="field-label">Image</label>
                <input key={fileKey} id="menu-img" type="file" accept="image/*" onChange={(e) => setImg(e.target.files?.[0] ?? null)} className="field" />
            </div>

            <div className="col-span-12 mt-6 flex justify-end gap-2">
                <button type="button" onClick={onCancel ?? clear} className="btn-ghost">{onCancel ? "Cancel" : "Reset"}</button>
                <button type="submit" disabled={isPending} className="classic disabled:opacity-60">{isPending ? "Saving..." : submitLabel}</button>
            </div>
        </form>
    )
}
