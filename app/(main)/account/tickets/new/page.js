import React from "react"
import Link from "next/link"
import UserPanelLayout from "../../UserPanelLayout"
import NewTicketForm from "@/components/template/tickets/NewTicketForm"

export default function page() {
    return (
        <UserPanelLayout title="New ticket">
            <Link href="/account/tickets" className="link-more mb-5">Back to tickets</Link>
            <NewTicketForm />
        </UserPanelLayout>
    )
}
