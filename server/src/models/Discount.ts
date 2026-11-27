import { Schema, model } from "mongoose"

const discountSchema = new Schema({
    code: { type: String, required: true, unique: true, trim: true, uppercase: true },
    kind: { type: String, enum: ["percent", "fixed"], required: true },
    value: { type: Number, required: true, min: 0 },
    minimumSubtotal: { type: Number, default: 0, min: 0 },
    usageLimit: { type: Number, default: null, min: 1, validate: (value: number | null) => value === null || Number.isInteger(value) },
    usedCount: { type: Number, default: 0, min: 0, validate: Number.isInteger },
    active: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null },
})

export default model("Discount", discountSchema)
