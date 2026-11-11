import type { ID } from "./api"
import type { Product } from "./product"

export type CommentStatus = "pending" | "accepted" | "rejected"

export interface CommentAnswer {
    _id?: ID
    text: string
    createdAt?: string
}

export interface Comment {
    _id: ID
    username: string
    email: string
    score: number
    body: string
    productID?: ID | Product
    isAccept?: boolean
    status?: CommentStatus
    parent?: ID | null
    answer?: CommentAnswer[]
    date?: string
    createdAt?: string
}

export interface CommentWithProduct extends Omit<Comment, "productID"> {
    productID?: Pick<Product, "_id" | "name"> | null
}

export interface ReplyCommentBody {
    parent: ID
    body: string
}

export interface UpdateCommentBody {
    body?: string
    score?: number
}
