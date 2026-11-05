"use client"
import AuthShell from "./authShell"
import PasswordInput from "./passwordInput"
import React from "react"
import { useMutation } from "@tanstack/react-query"
import { userValidationSchema } from "@/validators/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { manageError } from "@/utils/helper"
import { useRouter } from "next/navigation"
import axios from "axios"
import toast from "react-hot-toast"

export default function Register({ showloginForm }) {
    const router = useRouter()
    // React Hook Form setup
    const {
        register: formRegister,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(userValidationSchema),
    })

    // Mutation for registration
    const mutation = useMutation({
        mutationFn: async (data) => {
            const res = await axios.post("/api/auth/signup", data)
            return res.data
        },
        onSuccess: () => {
            toast.success("SignIn Successfully:)")
            router.replace("/")
        },
        onError: (error) => {
            const status = error.response?.status
            manageError(status)
        },
    })

    // Form submit handler
    const onSubmit = (data) => mutation.mutate(data)

    return (
        <>
            <AuthShell>
                    <div className="auth-head">
                        <h1>Create your account</h1>
                        <p>It takes a minute, and you can book and order right after.</p>
                    </div>

                    <form
                        className="auth-form"
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                    >
                        {/* Name */}
                        <div className="auth-group">
                            <div className="auth-input">
                                <input type="text" id="reg-name" aria-invalid={!!errors.name}
                                    {...formRegister("name")} autoComplete="name" />
                                <label htmlFor="reg-name">Name</label>
                                {errors.name && (
                                    <p className="auth-error">{errors.name.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="auth-group">
                            <div className="auth-input">
                                <input type="email" id="reg-email" aria-invalid={!!errors.email}
                                    {...formRegister("email")} autoComplete="email" />
                                <label htmlFor="reg-email">Email Address</label>
                                {errors.email && (
                                    <p className="auth-error">{errors.email.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Password */}
                        <div className="auth-group">
                            <PasswordInput id="reg-password" label="Password" error={errors.password?.message}
                                {...formRegister("password")} autoComplete="new-password" />
                        </div>

                        {/* Phone */}
                        <div className="auth-group">
                            <div className="auth-input">
                                <input type="tel" id="reg-phone" aria-invalid={!!errors.phone}
                                    {...formRegister("phone")} autoComplete="tel" />
                                <label htmlFor="reg-phone">Phone</label>
                                {errors.phone && (
                                    <p className="auth-error">{errors.phone.message}</p>
                                )}
                            </div>
                        </div>

                        <button type="submit" className="auth-btn disabled:cursor-not-allowed disabled:opacity-60" disabled={mutation.isPending}>
                        <span>{mutation.isPending ? "Creating account..." : "Sign Up"}</span>
                    </button>
                    </form>

                    {/* Sign In link */}
                    <div className="auth-switch">
                        <p>
                            Already have an account?{" "}
                            <button type="button" onClick={showloginForm}>Sign In</button>
                        </p>
                    </div>
            </AuthShell>
        </>
    )
}
