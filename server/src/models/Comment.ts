import { Schema, model, type Model, type Types } from "mongoose"
import Product from "./Product.js"
import { notifyAdmins, notifyUser } from "../utils/notify.js"

export const COMMENT_STATUSES = ["pending", "accepted", "rejected"] as const
export type CommentStatus = (typeof COMMENT_STATUSES)[number]

export interface IComment {
    productId: Types.ObjectId
    user: Types.ObjectId | null
    parent: Types.ObjectId | null
    username: string
    email: string
    score?: number
    body: string
    status: CommentStatus
    rejectReason: string | null
    editedAt: Date | null
    createdAt: Date
    updatedAt: Date
}

export interface CommentModel extends Model<IComment> {
    syncProductRating(productId: Types.ObjectId | string): Promise<void>
}

const commentSchema = new Schema<IComment, CommentModel>({
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", default: null },
    parent: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
    username: { type: String, required: true, trim: true },
    email: { type: String, default: "", trim: true, lowercase: true },
    score: {
        type: Number,
        min: 1,
        max: 5,
        required: [function (this: IComment) { return !this.parent }, "Score is required"],
        validate: {
            validator: function (this: IComment, value?: number) { return !this.parent || value === undefined },
            message: "Replies can not have a score",
        },
    },
    body: { type: String, required: true, trim: true },
    status: { type: String, enum: COMMENT_STATUSES, default: "pending" },
    rejectReason: {
        type: String,
        trim: true,
        default: null,
        required: [function (this: IComment) { return this.status === "rejected" }, "Reject reason is required"],
    },
    editedAt: { type: Date, default: null },
}, { timestamps: true })

commentSchema.index({ productId: 1, status: 1, createdAt: -1 })
commentSchema.index({ status: 1, createdAt: -1 })
commentSchema.index({ user: 1, createdAt: -1 })
commentSchema.index({ parent: 1 })
commentSchema.index(
    { user: 1, productId: 1 },
    { unique: true, partialFilterExpression: { user: { $type: "objectId" }, score: { $exists: true } } },
)

commentSchema.statics.syncProductRating = async function (productId) {
    const [stats] = await this.aggregate<{ avg: number; count: number }>([
        { $match: { productId, status: "accepted", parent: null } },
        { $group: { _id: null, avg: { $avg: "$score" }, count: { $sum: 1 } } },
    ])
    await Product.updateOne(
        { _id: productId },
        { $set: { score: stats ? Math.round(stats.avg * 10) / 10 : 0, ratingCount: stats?.count ?? 0 } },
    )
}

commentSchema.pre("validate", function () {
    if (this.isNew) return
    const edited = this.isModified("body") || this.isModified("score")
    if (edited && !this.isModified("status")) {
        this.editedAt = new Date()
        this.status = "pending"
    }
    if (this.status !== "rejected") this.rejectReason = null
})

commentSchema.pre("save", function () {
    this.$locals.wasNew = this.isNew
    this.$locals.statusChanged = !this.isNew && this.isModified("status")
})

commentSchema.post("save", async function (doc) {
    if (doc.$locals.wasNew) {
        if (!doc.parent) {
            await notifyAdmins({ type: "comment", title: "New review waiting", text: `${doc.username}: ${doc.body.slice(0, 80)}`, href: "/p-admin/comments", entityId: doc._id })
        }
        return
    }
    if (!doc.$locals.statusChanged) return
    if (!doc.parent) await Comment.syncProductRating(doc.productId)
    if (doc.status === "accepted") {
        await notifyUser(doc.user, { type: "comment", title: "Your review is live", href: `/products/${doc.productId}`, entityId: doc._id })
    }
    if (doc.status === "rejected") {
        await notifyUser(doc.user, { type: "comment", title: "Your review was not published", text: doc.rejectReason ?? undefined, href: "/account/comments", entityId: doc._id })
    }
    if (doc.status === "pending" && doc.editedAt) {
        await notifyAdmins({ type: "comment", title: "Edited review waiting", text: `${doc.username}: ${doc.body.slice(0, 80)}`, href: "/p-admin/comments", entityId: doc._id })
    }
})

commentSchema.post("deleteOne", { document: true, query: false }, async function (doc) {
    if (!doc.parent && doc.status === "accepted") await Comment.syncProductRating(doc.productId)
})

commentSchema.post("findOneAndDelete", async function (doc: IComment | null) {
    if (doc && !doc.parent && doc.status === "accepted") await Comment.syncProductRating(doc.productId)
})

const Comment = model<IComment, CommentModel>("Comment", commentSchema)

export default Comment
