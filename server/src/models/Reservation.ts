import { Schema, model, type Types } from "mongoose"
import { notifyAdmins, notifyUser } from "../utils/notify.js"
import { isReservationDate, isReservationSlot, RESERVATION_CLOCK, reservationInstant } from "../utils/reservationTime.js"

export const RESERVATION_STATUSES = ["pending", "confirmed", "canceled"] as const
export type ReservationStatus = (typeof RESERVATION_STATUSES)[number]


export interface IReservation {
    user: Types.ObjectId | null
    name: string
    email: string
    phone: string
    date: string
    time: string
    startsAt: Date
    guests: number
    notes: string
    status: ReservationStatus
    confirmedAt: Date | null
    canceledAt: Date | null
    canceledBy: "user" | "admin" | null
    cancelReason: string | null
    reminderSentAt: Date | null
    createdAt: Date
    updatedAt: Date
}

const reservationSchema = new Schema<IReservation>({
    user: { type: Schema.Types.ObjectId, ref: "User", default: null },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    date: { type: String, required: true, validate: [isReservationDate, "Pick a valid date"] },
    time: { type: String, required: true, match: RESERVATION_CLOCK },
    startsAt: { type: Date, required: true },
    guests: { type: Number, required: true, min: 1, max: 5, validate: [Number.isInteger, "Enter a whole number of guests"] },
    notes: { type: String, trim: true, maxlength: 300, default: "" },
    status: { type: String, enum: RESERVATION_STATUSES, default: "pending" },
    confirmedAt: { type: Date, default: null },
    canceledAt: { type: Date, default: null },
    canceledBy: { type: String, enum: ["user", "admin", null], default: null },
    cancelReason: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 300,
        default: null,
        required: [function (this: IReservation) { return this.status === "canceled" && this.canceledBy === "admin" }, "Cancel reason is required"],
    },
    reminderSentAt: { type: Date, default: null },
}, { timestamps: true, optimisticConcurrency: true })

reservationSchema.index({ date: 1, time: 1, status: 1 })
reservationSchema.index({ status: 1, createdAt: -1 })
reservationSchema.index({ user: 1, date: -1 })
reservationSchema.index({ status: 1, startsAt: 1, reminderSentAt: 1 })
reservationSchema.index({ date: 1, time: 1 }, {
    name: "one_confirmed_reservation_per_slot",
    unique: true,
    partialFilterExpression: { status: "confirmed" },
})

reservationSchema.pre("validate", function () {
    const scheduleChanged = this.isNew || this.isModified("date") || this.isModified("time")
    const startsAt = scheduleChanged || !this.startsAt ? reservationInstant(this.date, this.time) : this.startsAt
    if (!startsAt) {
        this.invalidate("time", "Pick a valid date and time")
        return
    }
    this.startsAt = startsAt
    if (scheduleChanged || (this.isModified("status") && this.status === "confirmed")) {
        if (!isReservationSlot(this.date, this.time)) this.invalidate("time", "Pick a half-hour slot during café opening hours")
        else if (startsAt.getTime() <= Date.now()) this.invalidate("time", "Pick a future time")
    }
    if (this.isNew && this.status !== "pending") this.invalidate("status", "New reservations must be pending")
})

reservationSchema.pre("save", function () {
    this.$locals.wasNew = this.isNew
    this.$locals.statusChanged = !this.isNew && this.isModified("status")
})

reservationSchema.post("save", async function (doc) {
    const adminHref = "/p-admin/reservations"
    if (doc.$locals.wasNew) {
        await notifyAdmins({ type: "reservation", title: "New reservation", text: `${doc.name} · ${doc.date} ${doc.time} · ${doc.guests} guests`, href: adminHref, entityId: doc._id })
        return
    }
    if (!doc.$locals.statusChanged) return
    if (doc.status === "canceled" && doc.canceledBy === "user") {
        await notifyAdmins({ type: "reservation", title: "Reservation canceled", text: `${doc.name} · ${doc.date} ${doc.time}`, href: adminHref, entityId: doc._id })
        return
    }
    if (doc.status !== "confirmed" && doc.status !== "canceled") return
    await notifyUser(doc.user, {
        type: "reservation",
        title: doc.status === "confirmed" ? "Your table is booked" : "Reservation canceled",
        text: doc.cancelReason ?? `${doc.date} at ${doc.time}`,
        href: "/account/reservations",
        entityId: doc._id,
    })
})

const Reservation = model<IReservation>("Reservation", reservationSchema)

export default Reservation
