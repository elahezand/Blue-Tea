import type { ID } from "./api"
import type { Product } from "./product"

export type CommentStatus = "pending" | "accepted" | "rejected"

export interface CommentAnswer {
    _id: ID
    username?: string
    text: string
    createdAt?: string
}

export interface Comment {
    _id: ID
    username: string
    email?: string
    score: number
    body: string
    productId?: ID | Product
    status?: CommentStatus
    rejectReason?: string | null
    parent?: ID | null
    answer?: CommentAnswer[]
    createdAt?: string
    editedAt?: string | null
}

export interface CommentWithProduct extends Omit<Comment, "productId"> {
    productId?: Pick<Product, "_id" | "name" | "img"> | null
}

export interface ReplyCommentBody {
    parent: ID
    body: string
}