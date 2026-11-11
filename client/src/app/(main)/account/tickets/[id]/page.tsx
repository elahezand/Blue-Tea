import type { RouteProps } from "@/types/api"
import { notFound } from "next/navigation"
import { isValidObjectId } from "@/utils/helper"
import TicketThread from "@/components/modules/tickets/ticketThread"
export default async function page({ params }: Pick<RouteProps<{ id: string }>, "params">) {
    const { id } = await params
    if (!isValidObjectId(id)) notFound()
    return <TicketThread id={id} />
}
