import { Schema, model, type Types } from "mongoose"
import { notifyAdmins, notifyUser } from "../utils/notify.js"

export const ORDER_STATUSES = ["pending", "paid", "processing", "shipped", "delivered", "canceled"] as const
export const PAYMENT_METHODS = ["online", "cash"] as const
export const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"] as const
export const ACTORS = ["user", "admin", "system"] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]
export type PaymentMethod = (typeof PAYMENT_METHODS)[number]
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]
export type Actor = (typeof ACTORS)[number]

export interface IOrderItem {
    _id: Types.ObjectId
    productId: Types.ObjectId
    grams: number
    quantity: number
    price: number
    finalPrice: number
    productSnapshot: { name: string; img: string | null; slug: string | null }
    isCanceled: boolean
    canceledAt: Date | null
}

export interface IOrder {
    orderNumber: string
    user: Types.ObjectId
    items: Types.DocumentArray<IOrderItem>
    discountCode: string | null
    pricing: { subtotal: number; discount: number; shippingCost: number; total: number }
    shippingAddress: { fullName: string; phone: string; address: string; city: string; postalCode: string | null }
    paymentMethod: PaymentMethod
    paymentStatus: PaymentStatus
    payment: { authority: string | null; refId: string | null; paidAt: Date | null }
    status: OrderStatus
    statusHistory: { status: OrderStatus; by: Actor; note?: string; at: Date }[]
    idempotencyKey: string | null
    stockReserved: boolean
    trackingCode: string | null
    shippedAt: Date | null
    expectedDeliveryAt: Date | null
    deliveredAt: Date | null
    buyerConfirmedAt: Date | null
    autoCompleteAt: Date | null
    canceledAt: Date | null
    canceledBy: Actor | null
    cancelReason: string | null
    refundAmount: number
    refundedAt: Date | null
    finalizedAt: Date | null
    createdAt: Date
    updatedAt: Date
}

const orderItemSchema = new Schema<IOrderItem>({
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    grams: { type: Number, required: true, min: 1 },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    finalPrice: { type: Number, required: true, min: 0 },
    productSnapshot: {
        name: { type: String, required: true },
        img: { type: String, default: null },
        slug: { type: String, default: null },
    },
    isCanceled: { type: Boolean, default: false },
    canceledAt: { type: Date, default: null },
})

const orderSchema = new Schema<IOrder>({
    orderNumber: { type: String, unique: true, default: () => `BT-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}` },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [orderItemSchema], validate: [(v: unknown[]) => v.length > 0, "Order items required"] },
    discountCode: { type: String, default: null },
    pricing: {
        subtotal: { type: Number, default: 0, min: 0 },
        discount: { type: Number, default: 0, min: 0 },
        shippingCost: { type: Number, default: 0, min: 0 },
        total: { type: Number, default: 0, min: 0 },
    },
    shippingAddress: {
        fullName: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        address: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        postalCode: { type: String, default: null },
    },
    paymentMethod: { type: String, enum: PAYMENT_METHODS, required: true },
    paymentStatus: { type: String, enum: PAYMENT_STATUSES, default: "pending" },
    payment: {
        authority: { type: String, default: null },
        refId: { type: String, default: null },
        paidAt: { type: Date, default: null },
    },
    status: { type: String, enum: ORDER_STATUSES, default: "pending" },
    statusHistory: [{
        _id: false,
        status: { type: String, enum: ORDER_STATUSES, required: true },
        by: { type: String, enum: ACTORS, required: true },
        note: String,
        at: { type: Date, default: Date.now },
    }],
    idempotencyKey: { type: String, default: null },
    stockReserved: { type: Boolean, default: false },
    trackingCode: { type: String, trim: true, default: null },
    shippedAt: { type: Date, default: null },
    expectedDeliveryAt: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },
    buyerConfirmedAt: { type: Date, default: null },
    autoCompleteAt: { type: Date, default: null },
    canceledAt: { type: Date, default: null },
    canceledBy: { type: String, enum: [...ACTORS, null], default: null },
    cancelReason: { type: String, default: null },
    refundAmount: { type: Number, default: 0, min: 0 },
    refundedAt: { type: Date, default: null },
    finalizedAt: { type: Date, default: null },
}, { timestamps: true, versionKey: false })

orderSchema.index({ user: 1, createdAt: -1 })
orderSchema.index({ status: 1, createdAt: -1 })
orderSchema.index({ "payment.authority": 1 })
orderSchema.index({ autoCompleteAt: 1 }, { partialFilterExpression: { status: "shipped" } })
orderSchema.index({ user: 1, idempotencyKey: 1 }, { unique: true, partialFilterExpression: { idempotencyKey: { $type: "string" } } })

orderSchema.pre("save", function () {
    this.$locals.wasNew = this.isNew
    this.$locals.statusChanged = !this.isNew && this.isModified("status")
})

orderSchema.post("save", async function (doc) {
    const adminHref = `/p-admin/orders/${doc._id}`
    if (doc.$locals.wasNew) {
        await notifyAdmins({ type: "order", title: "New order", text: `${doc.orderNumber} · $${doc.pricing.total}`, href: adminHref, entityId: doc._id })
        return
    }
    if (!doc.$locals.statusChanged) return
    if (doc.status === "canceled" && doc.canceledBy === "user") {
        await notifyAdmins({ type: "order", title: "Order canceled by customer", text: doc.orderNumber, href: adminHref, entityId: doc._id })
        return
    }
    await notifyUser(doc.user, { type: "order", title: `Order ${doc.status}`, text: doc.orderNumber, href: `/account/orders/${doc._id}`, entityId: doc._id })
})

const Order = model<IOrder>("Order", orderSchema)

export default Order