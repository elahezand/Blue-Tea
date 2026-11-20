import type { HydratedDocument, Types } from "mongoose"
import type { IUser } from "../models/User.js"
import type { AdminListQuery, ListQuery } from "../schemas/common.schema.js"
import type { ReplyTicketBody, TicketBody, UpdateTicketBody } from "../schemas/ticket.schema.js"
import { AppError } from "../utils/AppError.js"

const todo = (): never => {
    throw new AppError("Not implemented yet", 501)
}

type UserDoc = HydratedDocument<IUser>

export const create = async (_userId: Types.ObjectId, _body: TicketBody) => todo()
export const listMine = async (_userId: Types.ObjectId, _query: ListQuery) => todo()
export const getMine = async (_userId: Types.ObjectId, _id: string) => todo()
export const listReplies = async (_user: UserDoc, _id: string, _query: ListQuery) => todo()
export const reply = async (_user: UserDoc, _body: ReplyTicketBody) => todo()
export const update = async (_user: UserDoc, _id: string, _body: UpdateTicketBody) => todo()
export const listAdmin = async (_query: AdminListQuery) => todo()
export const getStats = async () => todo()
export const getAdminById = async (_id: string) => todo()
export const remove = async (_id: string) => todo()
