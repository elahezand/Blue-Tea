import { Schema, model } from "mongoose"

export const ARTICLE_STATUSES = ["publish", "unpublish"] as const
export type ArticleStatus = (typeof ARTICLE_STATUSES)[number]

export interface IArticle {
    title: string
    slug: string
    author: string
    shortDescription: string
    content: string
    cover?: string
    features: string[]
    status: ArticleStatus
    views: number
    date: Date
    createdAt: Date
    tags?:string[]
    updatedAt: Date
}

const articleSchema = new Schema<IArticle>({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    author: { type: String, default: "Blue Tea" },
    shortDescription: { type: String, default: "" },
    content: { type: String, default: "" },
    cover: String,
    features: [String],
    status: { type: String, enum: ARTICLE_STATUSES, default: "publish" },
    views: { type: Number, default: 0, min: 0 },
    date: { type: Date, default: Date.now },
}, { timestamps: true })

articleSchema.index({ status: 1, date: -1 })
articleSchema.index({ status: 1, views: -1 })
articleSchema.index({ title: "text", shortDescription: "text" })

const Article = model<IArticle>("Article", articleSchema)

export default Article