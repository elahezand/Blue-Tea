import type { Types } from "mongoose"
import { fileUrl } from "../middlewares/upload.js"
import { UPLOAD_DIR } from "../config/env.js"
import Session from "../models/Session.js"
import User, { type IUser } from "../models/User.js"
import type { AdminUserListQuery, CreateUserBody, ProfileBody } from "../schemas/user.schema.js"
import { AppError } from "../utils/AppError.js"
import { buildListQuery } from "../utils/buildListQuery.js"
import { removeUpload } from "../utils/files.js"
import { paginate } from "../utils/paginate.js"

const AVATAR_FOLDER = "avatars"
const ADMIN_FIELDS = "name email phone avatar role isBanned bannedAt banReason lastLoginAt createdAt updatedAt"

const removeAvatar = async (avatar?: string) => {
    if (avatar?.startsWith(`/${UPLOAD_DIR}/${AVATAR_FOLDER}/`)) await removeUpload(avatar)
}

export const getProfile = ({ _id, name, email, phone, avatar, role }: IUser & { _id: Types.ObjectId }) =>
    ({ _id, name, email, phone, avatar, role })

export const updateProfile = async (userId: Types.ObjectId, body: ProfileBody, file?: Express.Multer.File) => {
    const avatar = fileUrl(AVATAR_FOLDER, file)
    let previousAvatar: string | undefined
    let updated
    try {
        const user = await User.findById(userId).select("avatar").lean()
        if (!user) throw new AppError("User not found", 404)
        previousAvatar = user.avatar
        const filter = avatar ? { _id: userId, avatar: previousAvatar ?? null } : { _id: userId }
        updated = await User.findOneAndUpdate(filter, {
            $set: { name: body.name, email: body.email, ...(avatar ? { avatar } : {}) },
        }, { new: true, runValidators: true }).lean()
        if (!updated) throw new AppError("Profile changed. Reload and try again.", 409)
    } catch (error) {
        await removeAvatar(avatar)
        throw error
    }
    if (avatar) await removeAvatar(previousAvatar)
    return getProfile(updated)
}

export const listAdmin = ({ limit, cursor, q, role, status, from, to, preset }: AdminUserListQuery) =>
    paginate(User, {
        limit,
        cursor,
        filters: buildListQuery<IUser>({ q, from, to, preset }, {
            search: ["name", "email", "phone"],
            extra: {
                ...(role ? { role } : {}),
                ...(status === "banned" ? { isBanned: true } : {}),
                ...(status === "active" ? { isBanned: { $ne: true } } : {}),
            },
        }),
        select: ADMIN_FIELDS,
    })

export const create = (body: CreateUserBody) =>
    User.create({ name: body.name, email: body.email, phone: body.phone, role: body.role })

const findManageableUser = async (adminId: Types.ObjectId, id: string) => {
    if (adminId.equals(id)) throw new AppError("You cannot manage your own account here", 403)
    const user = await User.findById(id).select(ADMIN_FIELDS).lean()
    if (!user) throw new AppError("User not found", 404)
    if (user.role === "ADMIN") throw new AppError("Administrator accounts are protected", 403)
    return user
}

export const ban = async (adminId: Types.ObjectId, id: string, reason?: string) => {
    const user = await findManageableUser(adminId, id)
    const now = new Date()
    const banned = user.isBanned ? user : await User.findOneAndUpdate(
        { _id: id, role: { $ne: "ADMIN" }, isBanned: { $ne: true } },
        { $set: { isBanned: true, bannedAt: now, banReason: reason ?? null } },
        { new: true, runValidators: true },
    ).select(ADMIN_FIELDS).lean()
    if (!banned) throw new AppError("User changed. Reload and try again.", 409)
    await Session.updateMany({ user: banned._id, revokedAt: null }, { $set: { revokedAt: now } })
    return banned
}

export const unban = async (id: string) => {
    const user = await User.findByIdAndUpdate(id, {
        $set: { isBanned: false, bannedAt: null, banReason: null },
    }, { new: true, runValidators: true }).select(ADMIN_FIELDS).lean()
    if (!user) throw new AppError("User not found", 404)
    return user
}

export const remove = async (adminId: Types.ObjectId, id: string) => {
    await findManageableUser(adminId, id)
    const user = await User.findOneAndDelete({ _id: id, role: { $ne: "ADMIN" } }).select("avatar").lean()
    if (!user) throw new AppError("User changed. Reload and try again.", 409)
    await removeAvatar(user.avatar)
}
