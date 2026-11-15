import { Schema, model, type Types } from "mongoose"

export interface ISession {
    user: Types.ObjectId
    tokenHash: string
    userAgent?: string
    ip?: string
    lastUsedAt: Date
    expiresAt: Date
    revokedAt: Date | null
    createdAt: Date
    updatedAt: Date
}

const sessionSchema = new Schema<ISession>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tokenHash: { type: String, required: true, unique: true, select: false },
    userAgent: String,
    ip: String,
    lastUsedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date, default: null },
}, { timestamps: true })

sessionSchema.index({ user: 1, revokedAt: 1 })
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const Session = model<ISession>("Session", sessionSchema)

export default Session
