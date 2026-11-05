"use client"
import AuthShell from "./authShell"
import PasswordInput from "./passwordInput"
import Link from "next/link"
import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { manageError } from "@/utils/helper"
import toast from "react-hot-toast"

// Zod schema for validation
const loginSchema = z.object({
    email: z.string().email("Invalid email").nonempty("Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    remember: z.boolean().optional(),
})

export default function Login({ showRegisterForm }) {
    const router = useRouter()

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    })

    // Login mutation
    const mutation = useMutation({
        mutationFn: async (data) => {
            const res = await axios.post("/api/auth/signin", {
                identifier: data.email,
                password: data.password,
            })
            return res.data
        },
        onSuccess: () => {
            toast.success("LogIn Successfully:)")
            router.replace("/")
        },
        onError: (error) => {
            const status = error.response?.status
            manageError(status)
        },
    })

    // Submit handler
    const onSubmit = (data) => mutation.mutate(data)

    return (
        <AuthShell>
                <div className="auth-head">
                    <h1>Welcome back</h1>
                    <p>Sign in to track orders and book tables faster.</p>
                </div>

                <form
                    className="auth-form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    {/* Email */}
                    <div className="auth-group">
                        <div className="auth-input">
                            <input type="email" id="login-email" aria-invalid={!!errors.email}
                                {...register("email")}
                                autoComplete="email" />
                            <label htmlFor="login-email">Email Address</label>
                            {errors.email && (
                                <p className="auth-error">{errors.email.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Password */}
                    <div className="auth-group">
                        <PasswordInput id="login-password" label="Password" error={errors.password?.message}
                            {...register("password")} autoComplete="current-password" />
                    </div>

                    {/* Options */}
                    <div className="auth-options">
                        <div className="auth-remember">
                            <input type="checkbox"
                                {...register("remember")} />
                            <span className="text-sm text-fg">Remember me</span>
                        </div>
                        <Link href="/forgotPass" className="auth-link">
                            Forgot password?
                        </Link>
                    </div>

                    {/* Submit button */}
                    <button type="submit" className="auth-btn disabled:cursor-not-allowed disabled:opacity-60" disabled={mutation.isPending}>
                        <span>{mutation.isPending ? "Logging in..." : "Log in"}</span>
                    </button>
                </form>

                {/* Sign up link */}
                <div className="auth-switch">
                    <p>
                        Don&apos;t have an account?{" "}
                        <button type="button" onClick={() => showRegisterForm()}>Sign up</button>
                    </p>
                </div>
        </AuthShell>
    )
}
