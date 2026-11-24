import { Error as MongooseError, type FilterQuery, type HydratedDocument, type Types } from "mongoose"
import Reservation, { type IReservation, type ReservationStatus } from "../models/Reservation.js"
import type { AdminReservationListQuery, AdminUpdateReservationBody, MyReservationListQuery, ReservationBody, UpdateReservationBody } from "../schemas/reservation.schema.js"
import { AppError } from "../utils/AppError.js"
import { buildListQuery } from "../utils/buildListQuery.js"
import { paginate } from "../utils/paginate.js"
import { reservationInstant } from "../utils/reservationTime.js"

const transitions: Record<ReservationStatus, readonly ReservationStatus[]> = {
    pending: ["confirmed", "canceled"],
    confirmed: ["canceled"],
    canceled: [],
}

const guestRanges = {
    "1-2": { $gte: 1, $lte: 2 },
    "3-4": { $gte: 3, $lte: 4 },
    "5+": { $gte: 5 },
}
const CANCELLATION_NOTICE_MS = 3 * 60 * 60 * 1000

const findOr404 = async (filter: FilterQuery<IReservation>) => {
    const reservation = await Reservation.findOne(filter)
    if (!reservation) throw new AppError("Reservation not found", 404)
    return reservation
}

const assertTransition = (current: ReservationStatus, next: ReservationStatus) => {
    if (!transitions[current]?.includes(next)) {
        throw new AppError("This reservation status change is not allowed", 409, { status: "This reservation status change is not allowed" })
    }
}

const save = async (reservation: HydratedDocument<IReservation>) => {
    try {
        return await reservation.save()
    } catch (error) {
        if (error instanceof MongooseError.VersionError) {
            throw new AppError("Reservation changed. Reload and try again.", 409)
        }
        if (typeof error === "object" && error && "code" in error && error.code === 11000
            && "keyPattern" in error && typeof error.keyPattern === "object" && error.keyPattern
            && "date" in error.keyPattern && "time" in error.keyPattern) {
            throw new AppError("This time slot is already booked", 409, { time: "This time slot is already booked" })
        }
        throw error
    }
}

const cancel = async (reservation: HydratedDocument<IReservation>, canceledBy: "user" | "admin", reason: string | null) => {
    assertTransition(reservation.status, "canceled")
    const now = new Date()
    const startsAt = reservation.startsAt ?? reservationInstant(reservation.date, reservation.time)
    if (!startsAt || startsAt.getTime() - now.getTime() < CANCELLATION_NOTICE_MS) {
        throw new AppError("Reservations can only be canceled at least 3 hours before they start", 409)
    }
    reservation.set({ status: "canceled", canceledBy, cancelReason: reason, canceledAt: now })
    return save(reservation)
}

export const create = (userId: Types.ObjectId, body: ReservationBody) =>
    Reservation.create({ ...body, user: userId })

export const listMine = (userId: Types.ObjectId, { limit, cursor, status }: MyReservationListQuery) =>
    paginate(Reservation, {
        limit,
        cursor,
        filters: { user: userId, ...(status ? { status } : {}) },
        sort: { createdAt: -1 },
    })

export const updateMine = async (userId: Types.ObjectId, id: string, body: UpdateReservationBody) => {
    const reservation = await findOr404({ _id: id, user: userId })
    if (reservation.status !== "pending" && reservation.status !== "confirmed") {
        throw new AppError("This reservation can no longer be edited", 409)
    }
    const startsAt = reservation.startsAt ?? reservationInstant(reservation.date, reservation.time)
    if (!startsAt || startsAt.getTime() <= Date.now()) {
        throw new AppError("This reservation can no longer be edited", 409)
    }
    reservation.set(body)
    return save(reservation)
}

export const cancelByUser = async (userId: Types.ObjectId, id: string) =>
    cancel(await findOr404({ _id: id, user: userId }), "user", null)

export const listAdmin = ({ limit, cursor, q, status, guests, from, to }: AdminReservationListQuery) =>
    paginate(Reservation, {
        limit,
        cursor,
        filters: buildListQuery<IReservation>({ q, status }, {
            search: ["name", "email", "phone"],
            extra: {
                ...(guests ? { guests: guestRanges[guests] } : {}),
                ...(from || to ? { date: { ...(from ? { $gte: from } : {}), ...(to ? { $lte: to } : {}) } } : {}),
            },
        }),
        sort: { createdAt: -1 },
    })

export const updateByAdmin = async (id: string, { status, ...changes }: AdminUpdateReservationBody) => {
    const reservation = await findOr404({ _id: id })
    if (status !== undefined) assertTransition(reservation.status, status)
    reservation.set(changes)
    const scheduleChanged = reservation.isModified("date") || reservation.isModified("time")
    if (transitions[reservation.status]?.length === 0 && (scheduleChanged || reservation.isModified("guests"))) {
        throw new AppError("Closed reservations cannot be rescheduled", 409)
    }
    if (status !== undefined) reservation.status = status
    if (status === "confirmed") reservation.confirmedAt = new Date()
    return save(reservation)
}

export const cancelByAdmin = async (id: string, reason: string) =>
    cancel(await findOr404({ _id: id }), "admin", reason)
