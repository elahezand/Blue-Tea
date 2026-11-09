"use client"
import { usePathname } from "next/navigation"
import { PageHeader } from "@/components/modules/motion"

const TITLES: Record<string, string> = {
    "/account/orders": "My orders",
    "/account/reservations": "My reservations",
    "/account/comments": "My comments",
    "/account/tickets/new": "New ticket",
    "/account/tickets": "Support tickets",
    "/account/detail": "Account details",
    "/account/notifications": "Notifications",
}

const titleFor = (pathname: string): string => {
    if (TITLES[pathname]) return TITLES[pathname]
    if (pathname.startsWith("/account/tickets/")) return "Support ticket" 
    return "Your account"
}

export default function AccountHeader() {
    const pathname = usePathname()
    return <PageHeader crumbs={["Account"]} script="Your corner" title={titleFor(pathname)} />
}