import ReservationClient from "@/components/template/account/reservation/reservationClient"
import UserPanelLayout from "../UserPanelLayout"
export default function page() {
    return (
        <UserPanelLayout>
            <h4 className='fw-bold'
                style={{
                    color: "var(--brown-light)",
                    marginBottom: "1rem"
                }}>
                Reservations
            </h4>
            <ReservationClient />
        </UserPanelLayout>
    )
}
