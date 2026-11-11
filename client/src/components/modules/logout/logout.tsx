"use client"
import { MdLogout } from "react-icons/md"
import { useLogout } from "@/services/auth.service"

export default function Logout({ tone = "light" }: { tone?: "light" | "dark" }) {
    const { mutate: logout, isPending } = useLogout()

    return (
        <button type="button" disabled={isPending} onClick={() => logout()}
            className={`my-6 flex cursor-pointer items-center gap-2 rounded-full border border-solid bg-transparent px-5 py-2.5 text-sm font-medium transition-colors disabled:cursor-wait disabled:opacity-60 ${tone === "dark" ? "border-white/20 text-[var(--cream)] hover:bg-white/10" : "border-line text-fg hover:border-berry/50 hover:bg-berry/10 hover:text-berry"}`}>
            <MdLogout className="text-lg" />
            {isPending ? "Signing out..." : "Log out"}
        </button>
    )
}
