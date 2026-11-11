import type { ID } from "./api"

export type Role = "USER" | "ADMIN"

export interface User {
    _id: ID
    name: string
    email: string
    phone?: string
    role: Role
    avatar?: string
    isBanned?: boolean
    bannedAt?: string | null
    createdAt?: string
}

export interface CreateUserBody {
    name: string
    email: string
    phone: string
    role: Role
}
