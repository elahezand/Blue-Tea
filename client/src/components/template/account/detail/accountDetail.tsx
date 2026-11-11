"use client"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Loader from "@/components/feedback/loader"
import { useProfile, useUpdateProfile } from "@/services/user.service"
import { applyFieldErrors } from "@/utils/apiError"
import { profileSchema, type ProfileInput } from "@/validators/user"

export default function AccountDetail() {
    const { data: user, isLoading } = useProfile()
    const { mutate: updateProfile, isPending } = useUpdateProfile()
    const [avatar, setAvatar] = useState<File | null>(null)

    const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<ProfileInput>({
        resolver: zodResolver(profileSchema),
        defaultValues: { name: "", email: "" },
    })

    useEffect(() => {
        if (user) reset({ name: user.name ?? "", email: user.email ?? "" })
    }, [user, reset])

    const onSubmit = (values: ProfileInput) => {
        const formData = new FormData()
        formData.append("name", values.name)
        formData.append("email", values.email)
        if (avatar) formData.append("avatar", avatar)
        updateProfile({ payload: formData }, { onError: (error) => applyFieldErrors(error, setError) })
    }

    if (isLoading) return <Loader inline label="Loading your details" />

    return (
        <form className="admin-card grid max-w-3xl grid-cols-12 gap-4 !border-dashed p-6 sm:p-8" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="col-span-12">
                <label htmlFor="profile-name" className="field-label">Name</label>
                <input id="profile-name" type="text" {...register("name")} className="field" />
                {errors.name && <span className="text-sm text-berry">{errors.name.message}</span>}
            </div>
            <div className="col-span-12">
                <label htmlFor="profile-email" className="field-label">Email</label>
                <input id="profile-email" type="email" {...register("email")} className="field" />
                {errors.email && <span className="text-sm text-berry">{errors.email.message}</span>}
            </div>
            <div className="col-span-12">
                <label htmlFor="profile-phone" className="field-label">Phone</label>
                <input id="profile-phone" type="text" value={user?.phone ?? ""} readOnly disabled className="field opacity-70" />
                <span className="text-xs text-muted">You sign in with this number, so it can&apos;t be changed here.</span>
            </div>
            <div className="col-span-12">
                <label htmlFor="profile-avatar" className="field-label">Profile Picture</label>
                <input id="profile-avatar" type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files?.[0] ?? null)} className="field" />
            </div>
            <div className="col-span-12 mt-4 flex justify-end gap-2">
                <button type="button" onClick={() => user && reset({ name: user.name, email: user.email })} className="h-10 cursor-pointer rounded-full border border-solid border-line bg-transparent px-6 text-sm font-medium text-fg hover:bg-soft">Reset</button>
                <button type="submit" disabled={isPending} className="classic !h-10 !px-8 disabled:opacity-60">{isPending ? "Saving..." : "Save changes"}</button>
            </div>
        </form>
    )
}
