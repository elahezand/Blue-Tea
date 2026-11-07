"use client"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import AuthShell from "./authShell"
import {
    phoneLoginSchema,
    verifyCodeSchema,
    type PhoneLoginInput,
    type VerifyCodeInput,
} from "@/validators/auth"

const RESEND_SECONDS = 60

/* Login with a phone number only: 1) enter the number  2) enter the SMS code.
   A new number signs up automatically, so there is no separate register form. */
export default function PhoneLogin() {
    const [phone, setPhone] = useState<string | null>(null)   // set = we are on the code step
    const [secondsLeft, setSecondsLeft] = useState(0)

    const phoneForm = useForm<PhoneLoginInput>({ resolver: zodResolver(phoneLoginSchema), defaultValues: { phone: "" } })
    const codeForm = useForm<VerifyCodeInput>({ resolver: zodResolver(verifyCodeSchema), defaultValues: { code: "" } })

    // countdown for "send the code again"
    useEffect(() => {
        if (secondsLeft <= 0) return
        const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
        return () => clearTimeout(t)
    }, [secondsLeft])

    const sendCode = (data: PhoneLoginInput) => {
        // TODO: send-code request (removed for now), payload: { phone: data.phone }
        // When it is connected, move the two lines below into its onSuccess.
        setPhone(data.phone)
        setSecondsLeft(RESEND_SECONDS)
    }

    const resendCode = () => {
        if (!phone || secondsLeft > 0) return
        // TODO: send-code request again (removed for now), payload: { phone }
        setSecondsLeft(RESEND_SECONDS)
    }

    const verifyCode = (data: VerifyCodeInput) => {
        // TODO: verify-code request (removed for now), payload: { phone, code: data.code }
        // On success: the backend sets the cookies, then router.replace(next || "/")
        void data
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
                        <button type="submit" className="auth-btn disabled:cursor-not-allowed disabled:opacity-60">
                            <span>Send code</span>
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
                        <button type="submit" className="auth-btn disabled:cursor-not-allowed disabled:opacity-60">
                            <span>Sign in</span>
                        </button>
                    </form>
                    <div className="auth-options mt-4">
                        <button type="button" onClick={changeNumber} className="auth-link cursor-pointer border-none bg-transparent p-0">
                            Change number
                        </button>
                        <button type="button" onClick={resendCode} disabled={secondsLeft > 0}
                            className="auth-link cursor-pointer border-none bg-transparent p-0 disabled:cursor-default disabled:opacity-60">
                            {secondsLeft > 0 ? `Send again in ${secondsLeft}s` : "Send the code again"}
                        </button>
                    </div>
                </>
            )}
        </AuthShell>
    )
}
