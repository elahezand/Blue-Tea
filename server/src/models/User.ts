import { Schema, model } from "mongoose"

export const ROLES = ["USER", "ADMIN"] as const
export type Role = (typeof ROLES)[number]

export interface IUser {
    phone: string
    name: string
    email: string
    avatar?: string
    role: Role
    isBanned: boolean
    bannedAt: Date | null
    lastLoginAt?: Date
    createdAt: Date
    updatedAt: Date
}

const userSchema = new Schema<IUser>({
    phone: { type: String, required: true, unique: true, trim: true },
    name: { type: String, default: "", trim: true },
    email: { type: String, default: "", trim: true, lowercase: true },
    avatar: String,
    role: { type: String, enum: ROLES, default: "USER" },
    isBanned: { type: Boolean, default: false },
    bannedAt: { type: Date, default: null },
    lastLoginAt: Date,
}, { timestamps: true })

userSchema.index({ role: 1, createdAt: -1 })
userSchema.index({ isBanned: 1, createdAt: -1 })

const User = model<IUser>("User", userSchema)

export default User
