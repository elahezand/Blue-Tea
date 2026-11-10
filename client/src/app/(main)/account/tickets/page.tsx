import { Suspense } from "react"
import TicketsList from "@/components/template/account/tickets/ticketsList"

export const metadata = { title: "Support tickets" }
export default function page() {
    return (
        <Suspense>
            <TicketsList />
        </Suspense>
    )
}