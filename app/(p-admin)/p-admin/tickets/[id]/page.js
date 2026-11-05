import React from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { isValidObjectId } from "mongoose"
import connectToDB from "@/configs/db"
import TicketModel from "@/model/ticket"
import "@/model/user"
import TicketThread from "@/components/template/tickets/TicketThread"

export default async function page({ params }) {
    const { id } = await params
    if (!isValidObjectId(id)) notFound()
    await connectToDB()
    const ticket = await TicketModel.findById(id).populate("user", "name email").lean()
    if (!ticket) notFound()
    const t = JSON.parse(JSON.stringify(ticket))

    return (
        <div className="max-w-3xl">
            <Link href="/p-admin/tickets" className="link-more mb-5">Back to tickets</Link>
            <TicketThread ticket={t} isAdmin customer={t.user?.name ? `${t.user.name}${t.user.email ? ` (${t.user.email})` : ""}` : undefined} />
        </div>
    )
}
