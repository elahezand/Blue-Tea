import type { RouteProps } from "@/types/api"
import React from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { isValidObjectId } from "@/utils/helper"
import { getTicketById } from "@/services/ticket.service"
import TicketThread from "@/components/template/tickets/TicketThread"

export default async function page({ params }: Pick<RouteProps<{ id: string }>, "params">) {
    const { id } = await params
    if (!isValidObjectId(id)) notFound()
    const t = await getTicketById(id)
    if (!t) notFound()

    return (
        <div className="max-w-3xl">
            <Link href="/p-admin/tickets" className="link-more mb-5">Back to tickets</Link>
            <TicketThread ticket={t} isAdmin customer={t.user?.name ? `${t.user.name}${t.user.email ? ` (${t.user.email})` : ""}` : undefined} />
        </div>
    )
}
