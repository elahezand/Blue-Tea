import type { FilterQuery, HydratedDocument, Types } from "mongoose"
import { clearCache } from "../middlewares/cache.js"
import Comment, { COMMENT_STATUSES, type IComment } from "../models/Comment.js"
import Product from "../models/Product.js"
import type { IUser } from "../models/User.js"
import type { CommentBody, ReplyCommentBody } from "../schemas/comment.schema.js"
import type { AdminListQuery, ListQuery } from "../schemas/common.schema.js"
import { AppError } from "../utils/AppError.js"
import { buildListQuery } from "../utils/buildListQuery.js"
import { paginate } from "../utils/paginate.js"

type UserDoc = HydratedDocument<IUser>

const PUBLIC_FIELDS = "username score body parent productId createdAt editedAt"
const PRODUCT_FIELDS = "name img"

const withAnswers = async <T extends { _id: Types.ObjectId }>(comments: T[], onlyAccepted = true) => {
    if (!comments.length) return []
    const replies = await Comment.find({ parent: { $in: comments.map((c) => c._id) }, ...(onlyAccepted ? { status: "accepted" } : {}) })
        .sort({ createdAt: 1 })
        .select("parent username body createdAt")
        .lean()

    return comments.map((comment) => ({
        ...comment,
        answer: replies
            .filter((reply) => String(reply.parent) === String(comment._id))
            .map((reply) => ({ _id: reply._id, username: reply.username, text: reply.body, createdAt: reply.createdAt })),
    }))
}

const findOr404 = async (filter: FilterQuery<IComment>) => {
    const comment = await Comment.findOne(filter)
    if (!comment) throw new AppError("Review not found", 404)
    return comment
}


/* ---------- Public ---------- */

export const listForProduct = async (productId: string, { limit, cursor }: ListQuery) => {
    if (!(await Product.exists({ _id: productId }))) throw new AppError("Product not found", 404)

    const { data, pagination } = await paginate(Comment, {
        limit,
        cursor,
        filters: { productId, status: "accepted", parent: null },
        sort: { createdAt: -1 },
        select: PUBLIC_FIELDS,
    })

    return { data: await withAnswers(data), pagination }
}

export const listLatest = async ({ limit }: ListQuery) => {
    const comments = await Comment.find({ status: "accepted", parent: null })
        .sort({ createdAt: -1 })
        .limit(Math.min(limit ?? 6, 20))
        .select(PUBLIC_FIELDS)
        .populate("productId", PRODUCT_FIELDS)
        .lean()

    return withAnswers(comments)
}

/* ---------- User ---------- */

export const create = async (productId: string, body: CommentBody, user?: UserDoc) => {
    if (!(await Product.exists({ _id: productId }))) throw new AppError("Product not found", 404)
    return Comment.create({ ...body, productId, user: user?._id ?? null })
}

export const listMine = async (userId: Types.ObjectId, { limit, cursor }: ListQuery) => {
    const { data, pagination } = await paginate(Comment, {
        limit,
        cursor,
        filters: { user: userId, parent: null },
        sort: { createdAt: -1 },
        populate: { path: "productId", select: PRODUCT_FIELDS },
    })

    return { data: await withAnswers(data), pagination }
}

/* ---------- Admin ---------- */

const answeredFilter = async (answered?: boolean): Promise<FilterQuery<IComment> | undefined> => {
    if (answered === undefined) return undefined
    const ids = await Comment.distinct("parent", { parent: { $ne: null } })
    return { _id: answered ? { $in: ids } : { $nin: ids } }
}

export const listAdmin = async ({ limit, cursor, answered, ...query }: AdminListQuery) => {
    const { data, pagination } = await paginate(Comment, {
        limit,
        cursor,
        filters: buildListQuery<IComment>(query, {
            base: { parent: null },
            search: ["username", "email", "body"],
            statuses: COMMENT_STATUSES,
            ids: { product: "productId" },
            extra: await answeredFilter(answered),
        }),
        sort: { createdAt: -1 },
        populate: { path: "productId", select: PRODUCT_FIELDS },
    })

    return { data: await withAnswers(data, false), pagination }
}

export const accept = async (id: string) => {
    const comment = await findOr404({ _id: id, parent: null })
    comment.status = "accepted"
    await comment.save()
    await clearCache("comments", "products")
    return comment
}

export const reject = async (id: string, reason: string) => {
    const comment = await findOr404({ _id: id, parent: null })
    comment.status = "rejected"
    comment.rejectReason = reason
    await comment.save()
    await clearCache("comments", "products")
    return comment
}

export const reply = async (admin: UserDoc, { parent, body }: ReplyCommentBody) => {
    const comment = await findOr404({ _id: parent, parent: null })
    const answer = await Comment.create({
        productId: comment.productId,
        user: admin._id,
        parent: comment._id,
        username: admin.name || "Blue Tea",
        body,
        status: "accepted",
    })
    if (comment.status !== "accepted") {
        comment.status = "accepted"
        await comment.save()
    }
    await clearCache("comments", "products")
    return answer
}
export const remove = async (id: string) => {
    const comment = await findOr404({ _id: id })
    await Comment.deleteMany({ $or: [{ parent: comment._id }, { _id: comment._id }] })
    if (!comment.parent) await Comment.syncProductRating(comment.productId)
    await clearCache("comments", "products")
}