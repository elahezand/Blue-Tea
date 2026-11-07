"use client"
import Image from "next/image"
import { useProfile } from "@/hooks/useProfile"

export default function ProfileSummary() {
    const { data: user } = useProfile()
    if (!user) return null
    return (
        <>
            <Image
                src={user.avatar || "/images/default-avatar.png"}
                width={64}
                height={64}
                className="size-16 rounded-full border border-solid border-line object-cover"
                alt="User avatar"
            />
            <div className="min-w-0 flex-1">
                <p className="m-0 truncate font-display text-xl" style={{ color: "var(--head)" }}>{user.name}</p>
                <p className="m-0 truncate text-sm text-muted">{user.email}</p>
            </div>
        </>
    )
}
