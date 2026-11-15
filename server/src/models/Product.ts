import { Schema, model, type Types } from "mongoose"

export interface IVariant {
    grams: number
}

export interface IProductMetadata {
    origin?: string
    notes: string[]
    brewTemp?: number
    brewTime?: string
    brewAmount?: string
}

export interface IProduct {
    name: string
    slug: string
    price: number
    shortDescription: string
    longDescription: string
    tags: string[]
    variants: IVariant[]
    category: Types.ObjectId
    img: string
    score: number
    ratingCount: number
    stock: number
    sold: number
    views: number
    isAvailable: boolean
    metadata: IProductMetadata
    createdAt: Date
    updatedAt: Date
}

const variantSchema = new Schema<IVariant>({
    grams: { type: Number, required: true, min: 1 },
}, { _id: false })

const metadataSchema = new Schema<IProductMetadata>({
    origin: { type: String, trim: true },
    notes: [{ type: String, trim: true }],
    brewTemp: { type: Number, min: 0, max: 100 },
    brewTime: String,
    brewAmount: String,
}, { _id: false })

const productSchema = new Schema<IProduct>({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    price: { type: Number, required: true, min: 0 },
    shortDescription: { type: String, default: "" },
    longDescription: { type: String, default: "" },
    tags: [{ type: String, trim: true }],
    variants: { type: [variantSchema], default: [{ grams: 100 }] },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    img: { type: String, default: "" },
    score: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    sold: { type: Number, default: 0, min: 0 },
    views: { type: Number, default: 0, min: 0 },
    isAvailable: { type: Boolean, default: true },
    metadata: { type: metadataSchema, default: () => ({}) },
}, { timestamps: true })

productSchema.index({ category: 1, createdAt: -1 })
productSchema.index({ isAvailable: 1, sold: -1 })
productSchema.index({ isAvailable: 1, views: -1 })
productSchema.index({ isAvailable: 1, price: 1 })
productSchema.index({ name: "text", tags: "text" })

const Product = model<IProduct>("Product", productSchema)

export default Product