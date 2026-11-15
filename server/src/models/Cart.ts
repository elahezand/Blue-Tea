import { Schema, model, type Types } from "mongoose"

export const CART_STATUSES = ["active", "converted", "abandoned"] as const
export type CartStatus = (typeof CART_STATUSES)[number]

export interface ICartItem {
    _id: Types.ObjectId
    product: Types.ObjectId
    grams: number
    quantity: number
}

export interface ICart {
    user: Types.ObjectId
    items: Types.DocumentArray<ICartItem>
    discountCode: string | null
    status: CartStatus
    lockedUntil: Date | null
    expiresAt: Date | null
    createdAt: Date
    updatedAt: Date
}

const cartItemSchema = new Schema<ICartItem>({
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    grams: { type: Number, required: true, min: 1 },
    quantity: { type: Number, required: true, min: 1, max: 50 },
})

const cartSchema = new Schema<ICart>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [cartItemSchema], default: [] },
    discountCode: { type: String, default: null },
    status: { type: String, enum: CART_STATUSES, default: "active" },
    lockedUntil: { type: Date, default: null },
    expiresAt: { type: Date, default: null },
}, { timestamps: true, versionKey: false })

cartSchema.index({ user: 1 }, { unique: true, partialFilterExpression: { status: "active" } })
cartSchema.index({ user: 1, status: 1 })
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const Cart = model<ICart>("Cart", cartSchema)

export default Cart
