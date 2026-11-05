"use client"
import React from 'react'
import { MdLogout } from "react-icons/md"
import { usePost } from '@/utils/hooks/useReactQueryPanel';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';


export default function Logout({ tone = "light" }) {
    const router = useRouter()
    const { mutate } = usePost('/auth/signout', {
        onSuccess: () => {
            toast.success("LogOut Successfully .")
            router.replace("/login-register")
        }
    });
    const logOutHandeler = async () => {
        mutate()
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
