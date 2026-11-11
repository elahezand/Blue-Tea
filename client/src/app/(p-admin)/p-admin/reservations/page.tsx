import { Suspense } from "react"
import ReservationsList from "@/components/template/p-admin/reservations/reservationsList"

export default function page() {
    return (
        <Suspense>
            <ReservationsList />
        </Suspense>
    )
}
