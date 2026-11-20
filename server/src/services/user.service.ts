import type { Types } from "mongoose"
import type { AdminListQuery } from "../schemas/common.schema.js"
import type { CreateUserBody, ProfileBody } from "../schemas/user.schema.js"
import { AppError } from "../utils/AppError.js"

const todo = (): never => {
    throw new AppError("Not implemented yet", 501)
}

export const updateProfile = async (_userId: Types.ObjectId, _body: ProfileBody, _file?: Express.Multer.File) => todo()
export const listAdmin = async (_query: Partial<AdminListQuery>) => todo()
export const create = async (_body: CreateUserBody) => todo()
export const ban = async (_adminId: Types.ObjectId, _id: string, _reason?: string) => todo()
export const unban = async (_id: string) => todo()
export const remove = async (_adminId: Types.ObjectId, _id: string) => todo()
