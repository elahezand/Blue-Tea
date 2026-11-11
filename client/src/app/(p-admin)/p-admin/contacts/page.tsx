import { Suspense } from "react"
import ContactsList from "@/components/template/p-admin/contacts/contactsList"

export default function page() {
    return (
        <Suspense>
            <ContactsList />
        </Suspense>
    )
}
