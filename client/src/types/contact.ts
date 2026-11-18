import type { ID } from "./api"

export interface Contact {
    _id: ID
    user?: ID | null
    name: string
    email: string
    phone: string
    company?: string
    body: string
    answer: string[]
    answeredAt: string | null
    createdAt: string
}

export interface ReplyContactBody {
    contact: ID
    body: string
}

