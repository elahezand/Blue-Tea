import { keepPreviousData, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useInfiniteQuery, usePatch, usePost, usePut } from "@/hooks/useApi"
import { ACCOUNT_PER_PAGE, ADMIN_PER_PAGE, ENDPOINTS } from "@/utils/constant"
import type { ApiResponse } from "@/types/api"
import type { Reservation, ReservationStatus } from "@/types/reservation"
import type { ReservationEditOutput, ReservationInput } from "@/validators/reservation"

const RESERVATIONS_KEY = ["reservations"]
const ADMIN_RESERVATIONS_KEY = ["admin", "reservations"]
const ADMIN_DASHBOARD_KEY = ["admin", "dashboard"]

type ReservationResponse = ApiResponse<Reservation>
type ReservationListParams = { limit?: number; cursor?: string; status?: ReservationStatus }
type AdminReservationListParams = ReservationListParams & { q?: string; from?: string; to?: string; guests?: string }
type AdminReservationUpdate = Partial<ReservationEditOutput> & { status?: "confirmed" }

export const useBookTable = (onSuccessCallback?: (booking: Reservation) => void) => {
    const queryClient = useQueryClient()

    return usePost<ReservationResponse, ReservationInput>(ENDPOINTS.RESERVATIONS, {
        onSuccess: ({ data }) => {
            toast.success("Reservation request sent")
            queryClient.invalidateQueries({ queryKey: RESERVATIONS_KEY })
            onSuccessCallback?.(data)
        },
        errorFallback: "Couldn't book the table",
    })
}

export const useGetMyReservations = ({ status, limit = ACCOUNT_PER_PAGE, cursor }: ReservationListParams = {}) =>
    useInfiniteQuery<Reservation>(ENDPOINTS.MY_RESERVATIONS, { status, limit, cursor }, {
        queryKey: [...RESERVATIONS_KEY, "me", { status, limit, cursor }],
        placeholderData: keepPreviousData,
    })

export const useUpdateMyReservation = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient()

    return usePut<ReservationResponse, Partial<ReservationEditOutput>>(ENDPOINTS.MY_RESERVATIONS, {
        onSuccess: () => {
            toast.success("Your booking is updated")
            queryClient.invalidateQueries({ queryKey: RESERVATIONS_KEY })
            onSuccessCallback?.()
        },
        errorFallback: "Couldn't update your booking",
    })
}

export const useCancelMyReservation = () => {
    const queryClient = useQueryClient()

    return usePatch<ReservationResponse>(ENDPOINTS.MY_RESERVATIONS_CANCEL, {
        onSuccess: () => {
            toast.success("Your booking is canceled")
            queryClient.invalidateQueries({ queryKey: RESERVATIONS_KEY })
        },
        errorFallback: "Couldn't cancel your booking",
    })
}

export const useGetAdminReservations = (params: AdminReservationListParams = {}) =>
    useInfiniteQuery<Reservation>(ENDPOINTS.ADMIN_RESERVATIONS, { limit: ADMIN_PER_PAGE, ...params }, {
        queryKey: [...ADMIN_RESERVATIONS_KEY, params],
        placeholderData: keepPreviousData,
    })

export const useUpdateReservation = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient()

    return usePut<ReservationResponse, AdminReservationUpdate>(ENDPOINTS.RESERVATIONS, {
        onSuccess: () => {
            toast.success("Booking saved")
            queryClient.invalidateQueries({ queryKey: ADMIN_RESERVATIONS_KEY })
            queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_KEY })
            onSuccessCallback?.()
        },
        errorFallback: "Couldn't save the booking",
    })
}

export const useCancelReservation = () => {
    const queryClient = useQueryClient()

    return usePatch<ReservationResponse, { reason: string }>(ENDPOINTS.RESERVATIONS_CANCEL, {
        onSuccess: () => {
            toast.success("Booking canceled")
            queryClient.invalidateQueries({ queryKey: ADMIN_RESERVATIONS_KEY })
            queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_KEY })
        },
        errorFallback: "Couldn't cancel the booking",
    })
}
