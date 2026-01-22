"use client"
import React from 'react'
import { MdLogout } from "react-icons/md";
import { usePost } from '@/utils/hooks/useReactQueryPanel';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';


export default function Logout() {
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
            className="text-white d-flex gap-2 my-5 fs-5 align-items-center"
            onClick={logOutHandeler}>
            <MdLogout />
            EXIT
        </button>
    )
}
