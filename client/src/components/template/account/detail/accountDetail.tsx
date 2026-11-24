"use client"
import { useEffect, useRef } from "react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Loader from "@/components/feedback/loader"
import { useProfile, useUpdateProfile } from "@/services/user.service"
import { applyFieldErrors } from "@/utils/apiError"
import { profileSchema, type ProfileInput } from "@/validators/user"
import { IMAGE_ACCEPT } from "@/validators/file"

export default function AccountDetail() {
    const { data: user, isLoading, isError, refetch } = useProfile()
    const { mutate: updateProfile, isPending } = useUpdateProfile()
    const avatarInput = useRef<HTMLInputElement>(null)

    const { register, handleSubmit, reset, setValue, setError, formState: { errors } } = useForm<ProfileInput>({
        resolver: zodResolver(profileSchema),
        defaultValues: { name: "", email: "" },
    })

    useEffect(() => {
        if (user) reset({ name: user.name ?? "", email: user.email ?? "", avatar: null })
    }, [user, reset])

    const onSubmit = ({ avatar, ...values }: ProfileInput) => {
        let payload: typeof values | FormData = values
        if (avatar) {
            const form = new FormData()
            form.set("name", values.name)
            form.set("email", values.email)
            form.set("avatar", avatar)
            payload = form
        }
        updateProfile({ payload }, {
            onSuccess: () => { if (avatarInput.current) avatarInput.current.value = "" },
            onError: (error) => applyFieldErrors(error, setError),
        })
    }

    if (isLoading) return <Loader inline label="Loading your details" />
    if (isError || !user) return (
        <div className="admin-card w-full p-6" role="alert">
            <p className="mb-4">Couldn&apos;t load your profile.</p>
            <button type="button" onClick={() => void refetch()} className="btn btn-outline">Try again</button>
        </div>
    )

    return (
        <form className="admin-card grid w-full min-w-0 grid-cols-12 gap-4 !border-dashed p-4 sm:p-8" onSubmit={handleSubmit(onSubmit)} noValidate>
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
                {user.avatar && <Image src={user.avatar} alt="Current profile picture" width={64} height={64} className="no-tint mb-3 size-16 rounded-full object-cover" />}
                <input ref={avatarInput} id="profile-avatar" type="file" accept={IMAGE_ACCEPT}
                    aria-invalid={!!errors.avatar}
                    onChange={(event) => setValue("avatar", event.target.files?.[0] ?? null, { shouldValidate: true })}
                    className="field" />
                {errors.avatar && <span className="text-sm text-berry">{errors.avatar.message}</span>}
            </div>
            <div className="col-span-12 mt-4 flex flex-wrap justify-end gap-2">
                <button type="button" onClick={() => {
                    reset({ name: user.name, email: user.email, avatar: null })
                    if (avatarInput.current) avatarInput.current.value = ""
                }} className="h-10 cursor-pointer rounded-full border border-solid border-line bg-transparent px-6 text-sm font-medium text-fg hover:bg-soft">Reset</button>
                <button type="submit" disabled={isPending} className="classic !h-10 !px-8 disabled:opacity-60">{isPending ? "Saving..." : "Save changes"}</button>
            </div>
        </form>
    )
}
