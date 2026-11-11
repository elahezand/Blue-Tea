import type { ID } from "./api"

export type ArticleStatus = "publish" | "unpublish"

export interface Article {
    _id: ID
    title: string
    author: string
    shortDescription: string
    content: string
    cover?: string
    features?: string[]
    status?: ArticleStatus
    date?: string
    createdAt?: string
    updatedAt?: string
}
