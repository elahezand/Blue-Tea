"use client"
import { MdLogout } from "react-icons/md"

interface LogoutProps {
    tone?: "light" | "dark"
}

export default function Logout({ tone = "light" }: LogoutProps) {
    const logOutHandeler = () => {
        // TODO: sign-out request (removed for now). On success: toast + router.replace("/login-register")
    }
    return (
        <button
            className={`my-6 flex cursor-pointer items-center gap-2 rounded-full border border-solid bg-transparent px-5 py-2.5 text-sm font-medium transition-colors ${tone === "dark" ? "border-white/20 text-[var(--cream)] hover:bg-white/10" : "border-line text-fg hover:border-berry/50 hover:bg-berry/10 hover:text-berry"}`}
            onClick={logOutHandeler}>
            <MdLogout className="text-lg" />
            Log out
        </button>
    )
}
