"use client"
import React, { useState } from 'react'
import styles from "@/styles/login-register.module.css"
import { usePost } from '@/utils/hooks/useReactQueryPublic'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import toast from 'react-hot-toast'
import Footer from '@/components/modules/footer/footer'

// Zod schema for validation
const resetPasswordSchema = z.object({
    email: z.string().email("Invalid email").nonempty("Email is required"),
    resetCode: z.string().optional(),
    newPassword: z.string().min(6, "Password must be at least 6 characters").optional(),
})

export default function ForgotPass() {
    const [isShowPassword, setIsShowPassword] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
    })


    const { mutate: sendResetCode } = usePost("/auth/forgotPass", {
        onSuccess: () => {
            toast.success("Your code sent successfully :)")
            setIsShowPassword(true)
        },
    })

    const { mutate: resetPassword } = usePost("/auth/reset-pass", {
        onSuccess: () => toast.success("Your password reset successfully :)"),
    })

    const forgotPassHandler = (data) => {
        sendResetCode({ email: data.email })
    }

    const changePasswordHandler = (data) => {
        resetPassword({
            email: data.email,
            resetCode: data.resetCode,
            newPassword: data.newPassword
        })
    }

    return (
        <>
            <div className={styles.login_container}>
                <div className={styles.login_card}>
                    <div className={styles.login_header}>
                        <h2>Forgot Password</h2>
                        <p>Enter your email to reset your password</p>
                    </div>

                    {!isShowPassword ? (
                        <form
                            className={styles.login_form}
                            onSubmit={handleSubmit(forgotPassHandler)}
                            noValidate
                        >
                            <div className={styles.form_group}>
                                <div className={styles.input_wrapper}>
                                    <input
                                        type="email"
                                        {...register("email")}
                                        autoComplete="email"
                                    />
                                    <label>Email Address</label>
                                    <span className={styles.focus_border}></span>
                                    {errors.email && <p className={styles.error_message}>{errors.email.message}</p>}
                                </div>
                            </div>
                            <button type="submit" className={`${styles.login_btn} ${styles.btn}`}>
                                <span className={styles.btn_text}>Send Email</span>
                            </button>
                        </form>
                    ) : (
                        <form
                            className={styles.login_form}
                            onSubmit={handleSubmit(changePasswordHandler)}
                            noValidate
                        >
                            <div className={styles.form_group}>
                                <div className={styles.input_wrapper}>
                                    <input
                                        type="text"
                                        {...register("resetCode")}
                                        autoComplete="off"
                                    />
                                    <label>Reset Code</label>
                                    <span className={styles.focus_border}></span>
                                    {errors.resetCode && <p className={styles.error_message}>{errors.resetCode.message}</p>}
                                </div>
                            </div>

                            <div className={styles.form_group}>
                                <div className={styles.input_wrapper}>
                                    <input
                                        type="password"
                                        {...register("newPassword")}
                                        autoComplete="new-password"
                                    />
                                    <label>New Password</label>
                                    <span className={styles.focus_border}></span>
                                    {errors.newPassword && <p className={styles.error_message}>{errors.newPassword.message}</p>}
                                </div>
                            </div>

                            <button type="submit"
                                className={`${styles.login_btn} ${styles.btn}`}>
                                <span className={styles.btn_text}>Reset Password</span>
                            </button>
                        </form>
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
}
