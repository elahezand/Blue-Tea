import React from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { isValidObjectId } from "mongoose"
import connectToDB from "@/configs/db"
import TicketModel from "@/model/ticket"
import { authUser } from "@/utils/auth"
import UserPanelLayout from "../../UserPanelLayout"
import TicketThread from "@/components/template/tickets/TicketThread"

export default async function page({ params }) {
    const { id } = await params
    if (!isValidObjectId(id)) notFound()
    await connectToDB()
    const user = await authUser()
    const ticket = user ? await TicketModel.findOne({ _id: id, user: user._id }).lean() : null
    if (!ticket) notFound()

    return (
        <UserPanelLayout title="Support ticket">
            <Link href="/account/tickets" className="link-more mb-5">Back to tickets</Link>
            <TicketThread ticket={JSON.parse(JSON.stringify(ticket))} />
        </UserPanelLayout>
    )
}
