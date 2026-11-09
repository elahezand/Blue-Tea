import type { RouteProps } from "@/types/api"
import Link from "next/link"
import { notFound } from "next/navigation"
import { isValidObjectId } from "@/utils/helper"
import { getMe } from "@/services/auth.service"
import { getUserTicket } from "@/services/ticket.service"
import TicketThread from "@/components/template/tickets/TicketThread"

export default async function page({ params }: Pick<RouteProps<{ id: string }>, "params">) {
    const { id } = await params
    if (!isValidObjectId(id)) notFound()
    const user = await getMe()
    const ticket = user ? await getUserTicket(id, user._id) : null
    if (!ticket) notFound()

    return (
        <>
            <Link href="/account/tickets" className="link-more mb-5">Back to tickets</Link>
            <TicketThread ticket={ticket} />
        </>
    )
}
