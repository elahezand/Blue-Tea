"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreateUser } from "@/services/user.service"
import { applyFieldErrors } from "@/utils/apiError"
import { createUserSchema, type CreateUserInput } from "@/validators/user"

const EMPTY: CreateUserInput = { name: "", email: "", phone: "", role: "USER" }

export default function CreateUserForm() {
    const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<CreateUserInput>({
        resolver: zodResolver(createUserSchema),
        defaultValues: EMPTY,
    })
    const { mutate: createUser, isPending } = useCreateUser(() => reset(EMPTY))

    const onSubmit = (values: CreateUserInput) => createUser(values, { onError: (error) => applyFieldErrors(error, setError) })

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="panel-form">
            <div className="col-span-12 md:col-span-6">
                <label htmlFor="user-name" className="field-label">Name</label>
                <input id="user-name" type="text" {...register("name")} className="field" />
                {errors.name && <span className="text-sm text-berry">{errors.name.message}</span>}
            </div>
            <div className="col-span-12 md:col-span-6">
                <label htmlFor="user-email" className="field-label">Email</label>
                <input id="user-email" type="email" {...register("email")} className="field" />
                {errors.email && <span className="text-sm text-berry">{errors.email.message}</span>}
            </div>
            <div className="col-span-12 md:col-span-6">
                <label htmlFor="user-phone" className="field-label">Phone</label>
                <input id="user-phone" type="tel" inputMode="tel" {...register("phone")} className="field" placeholder="+14155550123" />
                {errors.phone && <span className="text-sm text-berry">{errors.phone.message}</span>}
            </div>
            <div className="col-span-12 md:col-span-6">
                <label htmlFor="user-role" className="field-label">Role</label>
                <select id="user-role" {...register("role")} className="field">
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                </select>
            </div>
            <div className="col-span-12 mt-6 flex justify-end gap-2">
                <button type="button" onClick={() => reset(EMPTY)} className="btn-ghost">Reset</button>
                <button type="submit" disabled={isPending} className="classic disabled:opacity-60">{isPending ? "Creating..." : "Create"}</button>
            </div>
        </form>
    )
}
