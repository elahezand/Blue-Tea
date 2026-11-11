import type { ID } from "./api"

export interface Contact {
    _id: ID
    name: string
    email: string
    phone: string
    company?: string
    body: string
    answer?: string | string[]
    createdAt?: string
}

export interface ReplyContactBody {
    contact: ID
    body: string
}
