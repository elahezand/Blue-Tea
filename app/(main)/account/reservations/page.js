import ReservationClient from "@/components/template/account/reservation/reservationClient"
import UserPanelLayout from "../UserPanelLayout"
export default function page() {
    return (
        <UserPanelLayout title="My reservations">
            <ReservationClient />
        </UserPanelLayout>
    )
}
