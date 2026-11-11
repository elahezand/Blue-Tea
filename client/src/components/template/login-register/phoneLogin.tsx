"use client"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import AuthShell from "./authShell"
import { Spinner } from "@/components/feedBack/Loader"
import { useResendCode, useSendCode, useVerifyCode } from "@/services/auth.service"
import {
    phoneLoginSchema,
    verifyCodeSchema,
    type PhoneLoginInput,
    type VerifyCodeInput,
} from "@/validators/auth"

const RESEND_SECONDS = 60

const safeNext = (next: string | null): string | null =>
    next && next.startsWith("/") && !next.startsWith("//") ? next : null

export default function PhoneLogin() {
    const next = safeNext(useSearchParams().get("next"))

    const [phone, setPhone] = useState<string | null>(null) 
    const [secondsLeft, setSecondsLeft] = useState(0)

    const phoneForm = useForm<PhoneLoginInput>({ resolver: zodResolver(phoneLoginSchema), defaultValues: { phone: "" } })
    const codeForm = useForm<VerifyCodeInput>({ resolver: zodResolver(verifyCodeSchema), defaultValues: { code: "" } })

    useEffect(() => {
        if (secondsLeft <= 0) return
        const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
        return () => clearTimeout(t)
    }, [secondsLeft])

    // after a code is sent (first time or again): timer back to 60 s, empty code box
    const startTimer = () => {
        setSecondsLeft(RESEND_SECONDS)
        codeForm.reset()
    }
    const { mutate: sendCodeRequest, isPending: sending } = useSendCode(startTimer)
    const { mutate: resendCodeRequest, isPending: resending } = useResendCode(startTimer)
    const { mutate: verifyCodeRequest, isPending: verifying, isSuccess: verified } = useVerifyCode(next)

    // step 1
    const sendCode = (data: PhoneLoginInput) => {
        sendCodeRequest({ phone: data.phone }, { onSuccess: () => setPhone(data.phone) })
    }

    // "Send the code again": only when the timer is over
    const resendCode = () => {
        if (!phone || secondsLeft > 0 || resending) return
        resendCodeRequest({ phone })
    }

    // step 2
    const verifyCode = (data: VerifyCodeInput) => {
        if (phone) verifyCodeRequest({ phone, code: data.code })
    }

    const changeNumber = () => {
        setPhone(null)
        setSecondsLeft(0)
        codeForm.reset()
    }

    const phoneError = phoneForm.formState.errors.phone?.message
    const codeError = codeForm.formState.errors.code?.message

    return (
        <AuthShell>
            {!phone ? (
                <>
                    <div className="auth-head">
                        <h1>Sign in</h1>
                        <p>Enter your mobile number and we will text you a code. New here? The same code creates your account.</p>
                    </div>
                    <form className="auth-form" onSubmit={phoneForm.handleSubmit(sendCode)} noValidate>
                        <div className="auth-group">
                            <div className="auth-input">
                                <input id="login-phone" type="tel" inputMode="numeric" autoComplete="tel" dir="ltr"
                                    placeholder="09xxxxxxxxx" maxLength={11} aria-invalid={!!phoneError}
                                    aria-describedby={phoneError ? "login-phone-error" : undefined}
                                    {...phoneForm.register("phone")} />
                                <label htmlFor="login-phone">Mobile number</label>
                                {phoneError && <p id="login-phone-error" className="auth-error" role="alert">{phoneError}</p>}
                            </div>
                        </div>
                        <button type="submit" disabled={sending} className="auth-btn disabled:cursor-not-allowed disabled:opacity-60">
                            {sending ? <Spinner label="Sending" /> : <span>Send code</span>}
                        </button>
                    </form>
                </>
            ) : (
                <>
                    <div className="auth-head">
                        <h1>Enter the code</h1>
                        <p>We sent a code to <span dir="ltr" className="font-medium text-fg">{phone}</span>.</p>
                    </div>
                    <form className="auth-form" onSubmit={codeForm.handleSubmit(verifyCode)} noValidate>
                        <div className="auth-group">
                            <div className="auth-input">
                                <input id="login-code" type="text" inputMode="numeric" autoComplete="one-time-code" dir="ltr"
                                    maxLength={6} autoFocus aria-invalid={!!codeError}
                                    aria-describedby={codeError ? "login-code-error" : undefined}
                                    className="text-center text-xl tracking-[0.5em]"
                                    {...codeForm.register("code")} />
                                <label htmlFor="login-code">SMS code</label>
                                {codeError && <p id="login-code-error" className="auth-error" role="alert">{codeError}</p>}
                            </div>
                        </div>
                        <button type="submit" disabled={verifying || verified} className="auth-btn disabled:cursor-not-allowed disabled:opacity-60">
                            {verifying || verified ? <Spinner label="Signing in" /> : <span>Sign in</span>}
                        </button>
                    </form>
                    <div className="auth-options mt-4">
                        <button type="button" onClick={changeNumber} className="auth-link cursor-pointer border-none bg-transparent p-0">
                            Change number
                        </button>
                        <button type="button" onClick={resendCode} disabled={secondsLeft > 0 || resending}
                            className="auth-link cursor-pointer border-none bg-transparent p-0 disabled:cursor-default disabled:opacity-60">
                            {resending ? "Sending..." : secondsLeft > 0 ? `Send again in ${secondsLeft}s` : "Send the code again"}
                        </button>
                    </div>
                </>
            )}
        </AuthShell>
    )
}