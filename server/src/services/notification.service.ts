import type { HydratedDocument, Types } from "mongoose"
import type { NotificationScope } from "../models/Notification.js"
import type { IUser } from "../models/User.js"
import type { ListQuery } from "../schemas/common.schema.js"
import { AppError } from "../utils/AppError.js"

const todo = (): never => {
    throw new AppError("Not implemented yet", 501)
}

export const list = async (_scope: NotificationScope, _userId: Types.ObjectId, _query: ListQuery) => todo()
export const markRead = async (_user: HydratedDocument<IUser>, _ids: string[]) => todo()
