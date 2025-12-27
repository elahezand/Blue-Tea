"use client"
import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { showSwal, manageError } from "@/utils/helper"
import styles from "@/styles/login-register.module.css"

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
            toast.success("LogIn Successfully:)"),
                router.push("/")
        },
        onError: (error) => {
            const status = error.response?.status
            manageError(status)
        },
    })

    // Submit handler
    const onSubmit = (data) => mutation.mutate(data)

    return (
        <div className={styles.login_container}>
            <div className={styles.login_card}>
                <div className={styles.login_header}>
                    <h2>Welcome Back</h2>
                    <p>Sign in to your account</p>
                </div>

                <form
                    className={styles.login_form}
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    {/* Email */}
                    <div className={styles.form_group}>
                        <div className={styles.input_wrapper}>
                            <input type="email"
                                {...register("email")} autoComplete="email" />
                            <label>Email Address</label>
                            <span className={styles.focus_border}></span>
                            {errors.email && (
                                <p className={styles.error_message}>{errors.email.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Password */}
                    <div className={styles.form_group}>
                        <div className={styles.input_wrapper}>
                            <input
                                type="password"
                                {...register("password")}
                                autoComplete="current-password"
                            />
                            <label>Password</label>
                            <span className={styles.focus_border}></span>
                            {errors.password && (
                                <p className={styles.error_message}>{errors.password.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Options */}
                    <div className={styles.form_options}>
                        <div className={styles.remember_wrapper}>
                            <input type="checkbox"
                                {...register("remember")} />
                            <span className={styles.checkbox_label}>Remember me</span>
                        </div>
                        <a href="#" className={styles.forgot_password}>
                            Forgot password?
                        </a>
                    </div>

                    {/* Submit button */}
                    <button type="submit" className={`${styles.login_btn} ${styles.btn}`}>
                        <span className={styles.btn_text}>LogIn</span>
                        <span className={styles.btn_loader}></span>
                    </button>
                </form>

                {/* Divider */}
                <div className={styles.divider}>
                    <span>or continue with</span>
                </div>

                {/* Social Login */}
                <div className={styles.social_login}>
                    <button type="button" className={`${styles.social_btn} ${styles.google_btn}`}>
                        <span className={`${styles.social_icon} ${styles.google_icon}`}></span>
                        Google
                    </button>
                    <button type="button" className={`${styles.social_btn} ${styles.github_btn}`}>
                        <span className={`${styles.social_icon} ${styles.github_icon}`}></span>
                        GitHub
                    </button>
                </div>

                {/* Sign up link */}
                <div className={styles.signup_link}>
                    <p>
                        Dont have an account?{" "}
                        <span onClick={() => showRegisterForm()}>Sign up</span>
                    </p>
                </div>
            </div>
        </div>
    )
}
