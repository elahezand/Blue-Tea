import type { ID } from "./api"

export const RESERVATION_STATUS_LABELS = {
    pending: "Pending",
    confirmed: "Confirmed",
    canceled: "Canceled",
} as const

export type ReservationStatus = keyof typeof RESERVATION_STATUS_LABELS

export const isReservationStatus = (value: string | null): value is ReservationStatus =>
    value !== null && Object.hasOwn(RESERVATION_STATUS_LABELS, value)

export interface Reservation {
    _id: ID
    name: string
    email: string
    phone: string
    date: string
    time: string
    guests: number
    notes?: string
    status: ReservationStatus
    startsAt?: string
    createdAt?: string
}
