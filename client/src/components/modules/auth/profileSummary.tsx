"use client"
import UserAvatar from "@/components/modules/userAvatar"
import { useProfile } from "@/services/user.service"

export default function ProfileSummary() {
    const { data: user } = useProfile()
    if (!user) return null
    return (
        <>
            <UserAvatar name={user.name} src={user.avatar} size={64} className="border border-solid border-line" />
            <div className="min-w-0 flex-1">
                <p className="m-0 truncate font-display text-xl" style={{ color: "var(--head)" }}>{user.name}</p>
                <p className="m-0 truncate text-sm text-muted">{user.email}</p>
            </div>
        </>
    )
}
