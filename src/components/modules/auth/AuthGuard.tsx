"use client"
import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import Loader from "@/components/feedBack/Loader"
import { useProfile } from "@/hooks/useProfile"
import { ROLES, ROUTES } from "@/utils/constant"
import type { Role } from "@/types/models"

interface AuthGuardProps {
    children: ReactNode
    role?: Role
}

export default function AuthGuard({ children, role }: AuthGuardProps) {
    const router = useRouter()
    const { data: user, isLoading, isError } = useProfile()
    const wrongRole = !!user && !!role && user.role !== role

    useEffect(() => {
        if (wrongRole) router.replace(role === ROLES.ADMIN ? ROUTES.ACCOUNT : ROUTES.HOME)
    }, [wrongRole, role, router])

    if (isLoading) return <Loader />
    if (isError || !user || wrongRole) return null

    return <>{children}</>
}
