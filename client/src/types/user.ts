import type { ID } from "./api"

export type Role = "USER" | "ADMIN"
export type UserStatus = "active" | "banned"

export interface UserListParams {
    limit?: number
    cursor?: string
    q?: string
    role?: Role
    status?: UserStatus
    from?: string
    to?: string
}

export interface User {
    _id: ID
    name: string
    email: string
    phone?: string
    role: Role
    avatar?: string
    isBanned?: boolean
    bannedAt?: string | null
    banReason?: string | null
    createdAt?: string
}

export interface CreateUserBody {
    name: string
    email: string
    phone: string
    role: Role
}
