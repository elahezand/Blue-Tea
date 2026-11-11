import { Suspense } from "react"
import TicketsList from "@/components/template/p-admin/tickets/ticketsList"

export default function page() {
    return (
        <Suspense>
            <TicketsList />
        </Suspense>
    )
}
