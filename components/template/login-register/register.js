"use client"
import React from "react"
import styles from "@/styles/login-register.module.css"
import { useMutation } from "@tanstack/react-query"
import { userValidationSchema } from "@/validators/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { manageError } from "@/utils/helper"
import axios from "axios"
import toast from "react-hot-toast"

export default function Register({ showloginForm }) {

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
        onSuccess: () => toast.success("LogIn Successfully:)"),

        onError: (error) => {
            const status = error.response?.status
            manageError(status)
        },
    })

    // Form submit handler
    const onSubmit = (data) => mutation.mutate(data)

    return (
        <>
            <div className={styles.login_container}>
                <div className={styles.login_card}>
                    <div className={styles.login_header}>
                        <h2>Welcome Back</h2>
                        <p>Create your account</p>
                    </div>

                    <form
                        className={styles.login_form}
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                    >
                        {/* Name */}
                        <div className={styles.form_group}>
                            <div className={styles.input_wrapper}>
                                <input type="text"
                                    {...formRegister("name")} autoComplete="name" />
                                <label>Name</label>
                                <span className={styles.focus_border}></span>
                                {errors.name && (
                                    <p className={styles.error_message}>{errors.name.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div className={styles.form_group}>
                            <div className={styles.input_wrapper}>
                                <input type="email"
                                    {...formRegister("email")} autoComplete="email" />
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
                                <input type="password"
                                    {...formRegister("password")} autoComplete="new-password" />
                                <label>Password</label>
                                <span className={styles.focus_border}></span>
                                {errors.password && (
                                    <p className={styles.error_message}>{errors.password.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Phone */}
                        <div className={styles.form_group}>
                            <div className={styles.input_wrapper}>
                                <input type="text"
                                    {...formRegister("phone")} autoComplete="tel" />
                                <label>Phone</label>
                                <span className={styles.focus_border}></span>
                                {errors.phone && (
                                    <p className={styles.error_message}>{errors.phone.message}</p>
                                )}
                            </div>
                        </div>

                        <button type="submit" className={`${styles.login_btn} ${styles.btn}`}>
                            <span className={styles.btn_text}>Sign Up</span>
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

                    {/* Sign In link */}
                    <div className={styles.signup_link}>
                        <p>
                            Already have an account?{" "}
                            <span onClick={showloginForm}>Sign In</span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
