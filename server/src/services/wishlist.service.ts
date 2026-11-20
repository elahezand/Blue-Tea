import type { Types } from "mongoose"
import type { ListQuery } from "../schemas/common.schema.js"
import { AppError } from "../utils/AppError.js"

const todo = (): never => {
    throw new AppError("Not implemented yet", 501)
}

export const list = async (_userId: Types.ObjectId, _query: ListQuery) => todo()
export const toggle = async (_userId: Types.ObjectId, _productId: string) => todo()
