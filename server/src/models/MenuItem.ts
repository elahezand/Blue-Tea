import { Schema, model, type Types } from "mongoose"

export interface IMenuItem {
    category: Types.ObjectId
    name: string
    description: string
    price: number
    size?: string
    img?: string
    isAvailable: boolean
    createdAt: Date
    updatedAt: Date
}

const menuItemSchema = new Schema<IMenuItem>({
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    size: String,
    img: String,
    isAvailable: { type: Boolean, default: true },
}, { timestamps: true })

menuItemSchema.index({ category: 1, isAvailable: 1 })

const MenuItem = model<IMenuItem>("MenuItem", menuItemSchema)

export default MenuItem