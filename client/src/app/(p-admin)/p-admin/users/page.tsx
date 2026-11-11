import { Suspense } from "react"
import UsersList from "@/components/template/p-admin/users/usersList"

export default function page() {
    return (
        <Suspense>
            <UsersList />
        </Suspense>
    )
}
