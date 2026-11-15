import { Schema, model, type Types } from "mongoose"

export const CATEGORY_TYPES = ["shop", "menu"] as const
export type CategoryType = (typeof CATEGORY_TYPES)[number]

export interface ICategory {
    name: string
    slug: string
    type: CategoryType
    parentId: Types.ObjectId | null
    img?: string
    createdAt: Date
    updatedAt: Date
}

const categorySchema = new Schema<ICategory>({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    type: { type: String, enum: CATEGORY_TYPES, default: "shop" },
    parentId: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    img: String,
}, { timestamps: true })

categorySchema.index({ type: 1, slug: 1 }, { unique: true })
categorySchema.index({ type: 1, parentId: 1 })

const Category = model<ICategory>("Category", categorySchema)

export default Category