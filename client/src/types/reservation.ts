import type { ID } from "./api"

export type ReservationStatus = "Pending" | "Confirmed" | "Cancelled"

export interface Reservation {
    _id: ID
    name: string
    email: string
    phone: string
    date: string
    time: string
    guests: number
    notes?: string
    status?: ReservationStatus
    createdAt?: string
}
