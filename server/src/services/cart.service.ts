import type { Types } from "mongoose"
import type { AddToCartBody, SyncCartBody } from "../schemas/cart.schema.js"
import type { AdminListQuery } from "../schemas/common.schema.js"
import { AppError } from "../utils/AppError.js"

const todo = (): never => {
    throw new AppError("Not implemented yet", 501)
}

export const getCart = async (_userId: Types.ObjectId) => todo()
export const addItem = async (_userId: Types.ObjectId, _body: AddToCartBody) => todo()
export const removeItem = async (_userId: Types.ObjectId, _itemId: string) => todo()
export const clear = async (_userId: Types.ObjectId) => todo()
export const applyDiscount = async (_userId: Types.ObjectId, _code: string) => todo()
export const sync = async (_userId: Types.ObjectId, _items: SyncCartBody["items"]) => todo()
export const listAdmin = async (_query: AdminListQuery) => todo()
export const remove = async (_id: string) => todo()
