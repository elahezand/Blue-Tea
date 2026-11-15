import { Schema, model, type Types } from "mongoose"
import { notifyAdmins, notifyUser } from "../utils/notify.js"

export const RESERVATION_STATUSES = ["pending", "confirmed", "canceled", "completed", "no_show"] as const
export type ReservationStatus = (typeof RESERVATION_STATUSES)[number]

export interface IReservation {
    user: Types.ObjectId | null
    name: string
    email: string
    phone: string
    date: string
    time: string
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
    date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    time: { type: String, required: true, match: /^\d{2}:\d{2}$/ },
    guests: { type: Number, required: true, min: 1, max: 5 },
    notes: { type: String, default: "" },
    status: { type: String, enum: RESERVATION_STATUSES, default: "pending" },
    confirmedAt: { type: Date, default: null },
    canceledAt: { type: Date, default: null },
    canceledBy: { type: String, enum: ["user", "admin", null], default: null },
    cancelReason: {
        type: String,
        trim: true,
        default: null,
        required: [function (this: IReservation) { return this.status === "canceled" && this.canceledBy === "admin" }, "Cancel reason is required"],
    },
    reminderSentAt: { type: Date, default: null },
}, { timestamps: true, versionKey: false })

reservationSchema.index({ date: 1, time: 1, status: 1 })
reservationSchema.index({ status: 1, createdAt: -1 })
reservationSchema.index({ user: 1, date: -1 })
reservationSchema.index({ status: 1, date: 1, reminderSentAt: 1 })

reservationSchema.pre("validate", function () {
    if (this.isNew || !this.isModified("status")) return
    const now = new Date()
    if (this.status === "confirmed") this.confirmedAt = now
    if (this.status === "canceled") this.canceledAt = now
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