"use client"
import AuthShell from '@/components/template/login-register/authShell'
import React, { useState } from 'react'
import { usePost } from '@/utils/hooks/useReactQueryPublic'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import toast from 'react-hot-toast'
import Link from 'next/link'
import PasswordInput from '@/components/template/login-register/passwordInput'

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


    const { mutate: sendResetCode, isPending: sending } = usePost("/auth/forgotPass", {
        onSuccess: () => {
            toast.success("We sent a code to your email.")
            setIsShowPassword(true)
        },
        onError: () => toast.error("We could not send the code. Check the email and try again."),
    })

    const { mutate: resetPassword, isPending: resetting } = usePost("/auth/reset-pass", {
        onSuccess: () => toast.success("Password updated. You can sign in now."),
        onError: () => toast.error("That code did not work. Check it and try again."),
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
            <AuthShell>
                    <div className="auth-head">
                        <h1>{isShowPassword ? "Check your email" : "Forgot your password?"}</h1>
                        <p>{isShowPassword ? "Enter the code we sent you and choose a new password." : "Enter your email and we will send you a reset code."}</p>
                    </div>

                    {!isShowPassword ? (
                        <form
                            className="auth-form"
                            onSubmit={handleSubmit(forgotPassHandler)}
                            noValidate>
                            <div className="auth-group">
                                <div className="auth-input">
                                    <input
                                        type="email" id="fp-email" aria-invalid={!!errors.email}
                                        {...register("email")}
                                        autoComplete="email"
                                    />
                                    <label htmlFor="fp-email">Email Address</label>
                                    {errors.email && <p className="auth-error">{errors.email.message}</p>}
                                </div>
                            </div>
                            <button type="submit" className="auth-btn disabled:cursor-wait disabled:opacity-60" disabled={sending}>
                                <span>{sending ? "Sending..." : "Send reset code"}</span>
                            </button>
                        </form>
                    ) : (
                        <form
                            className="auth-form"
                            onSubmit={handleSubmit(changePasswordHandler)}
                            noValidate
                        >
                            <div className="auth-group">
                                <div className="auth-input">
                                    <input
                                        type="text" id="fp-code" inputMode="numeric"
                                        {...register("resetCode")}
                                        autoComplete="one-time-code"
                                    />
                                    <label htmlFor="fp-code">Reset code</label>
                                    {errors.resetCode && <p className="auth-error">{errors.resetCode.message}</p>}
                                </div>
                            </div>

                            <div className="auth-group">
                                <PasswordInput id="fp-new" label="New password" error={errors.newPassword?.message}
                                    {...register("newPassword")} autoComplete="new-password" />
                            </div>

                            <button type="submit"
                                className="auth-btn disabled:cursor-wait disabled:opacity-60" disabled={resetting}>
                                <span>{resetting ? "Updating..." : "Update password"}</span>
                            </button>
                        </form>
                    )}
                    <div className="auth-switch">
                        <p><Link href="/login-register" className="font-medium text-link underline">Back to sign in</Link></p>
                    </div>
                </AuthShell>
        </>
    )
}
