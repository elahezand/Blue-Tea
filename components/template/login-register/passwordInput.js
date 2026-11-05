"use client"
import { useState } from "react"
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md"

/* Password field with a show/hide toggle. Spread react-hook-form's register() into the props. */
export default function PasswordInput({ id, label, error, ...inputProps }) {
    const [show, setShow] = useState(false)
    return (
        <div className="auth-input">
            <div className="relative">
                <input id={id} type={show ? "text" : "password"} aria-invalid={!!error} className="pe-12" {...inputProps} />
                <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide password" : "Show password"} aria-pressed={show}
                    className="absolute inset-y-0 end-1 flex w-10 cursor-pointer items-center justify-center border-none bg-transparent text-xl text-muted hover:text-link">
                    {show ? <MdOutlineVisibilityOff /> : <MdOutlineVisibility />}
                </button>
            </div>
            <label htmlFor={id}>{label}</label>
            {error && <p className="auth-error" role="alert">{error}</p>}
        </div>
    )
}
