import { keepPreviousData, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useInfiniteQuery, usePatch, usePost, usePut } from "@/hooks/useApi"
import { ENDPOINTS } from "@/utils/constant"
import type { ApiResponse, ListParams } from "@/types/api"
import type { Reservation } from "@/types/models"
import type { ReservationInput } from "@/validators/reservation"

const RESERVATIONS_KEY = ["reservations"]
const ADMIN_RESERVATIONS_KEY = ["admin", "reservations"]
const ADMIN_DASHBOARD_KEY = ["admin", "dashboard"]

type ReservationResponse = ApiResponse<Reservation>

export const useBookTable = (onBooked?: (booking: ReservationInput) => void) => {
    const queryClient = useQueryClient()

    return usePost<unknown, ReservationInput>(ENDPOINTS.RESERVATIONS, {
        onSuccess: (_, booking) => {
            toast.success("Your table is booked")
            queryClient.invalidateQueries({ queryKey: RESERVATIONS_KEY })
            onBooked?.(booking)
        },
        errorFallback: "Couldn't book the table",
    })
}

export const useGetMyReservations = (params: ListParams = {}) =>
    useInfiniteQuery<Reservation>(ENDPOINTS.MY_RESERVATIONS, params, {
        queryKey: [...RESERVATIONS_KEY, "me", params],
        placeholderData: keepPreviousData,
    })

export const useUpdateMyReservation = (onSaved?: () => void) => {
    const queryClient = useQueryClient()

    return usePut<ReservationResponse, Partial<ReservationInput>>(ENDPOINTS.MY_RESERVATIONS, {
        onSuccess: () => {
            toast.success("Your booking is updated")
            queryClient.invalidateQueries({ queryKey: RESERVATIONS_KEY })
            onSaved?.()
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

export const useGetAdminReservations = (params: ListParams = {}) =>
    useInfiniteQuery<Reservation>(ENDPOINTS.ADMIN_RESERVATIONS, params, {
        queryKey: [...ADMIN_RESERVATIONS_KEY, params],
        placeholderData: keepPreviousData,
    })

export const useUpdateReservation = (onSaved?: () => void) => {
    const queryClient = useQueryClient()

    return usePut<ReservationResponse, Partial<ReservationInput>>(ENDPOINTS.RESERVATIONS, {
        onSuccess: () => {
            toast.success("Booking saved")
            queryClient.invalidateQueries({ queryKey: ADMIN_RESERVATIONS_KEY })
            queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_KEY })
            onSaved?.()
        },
        errorFallback: "Couldn't save the booking",
    })
}

export const useCancelReservation = () => {
    const queryClient = useQueryClient()

    return usePatch<ReservationResponse>(ENDPOINTS.RESERVATIONS_CANCEL, {
        onSuccess: () => {
            toast.success("Booking canceled")
            queryClient.invalidateQueries({ queryKey: ADMIN_RESERVATIONS_KEY })
            queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_KEY })
        },
        errorFallback: "Couldn't cancel the booking",
    })
}

