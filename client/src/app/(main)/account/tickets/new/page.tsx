import Link from "next/link"
import NewTicketForm from "@/components/template/account/tickets/newTicketForm"

export default function page() {
    return (
        <>
            <Link href="/account/tickets" className="link-more mb-5">Back to tickets</Link>
            <NewTicketForm />
        </>
    )
}
