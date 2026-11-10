import toast from "react-hot-toast"
import { emptyPage } from "./empty"
import { usePost } from "@/hooks/useApi"
import { ENDPOINTS } from "@/utils/constant"
import type { ListParams, Paginated } from "@/types/api"
import type { Reservation } from "@/types/models"
import type { ReservationInput } from "@/validators/reservation"

export const useBookTable = (onBooked?: (booking: ReservationInput) => void) =>
    usePost<unknown, ReservationInput>(ENDPOINTS.RESERVATIONS, {
        onSuccess: (_, booking) => {
            toast.success("Your table is booked")
            onBooked?.(booking)
        },
        errorFallback: "Couldn't book the table",
    })

export const getAdminReservations = async (params: ListParams): Promise<Paginated<Reservation>> => {
    return emptyPage(params)
}
