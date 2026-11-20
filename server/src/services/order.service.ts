import type { Types } from "mongoose"
import type { AdminListQuery, ListQuery } from "../schemas/common.schema.js"
import type { CancelItemBody, CreateOrderBody, PaymentCallbackQuery, ShipOrderBody } from "../schemas/order.schema.js"
import { AppError } from "../utils/AppError.js"

const todo = (): never => {
    throw new AppError("Not implemented yet", 501)
}

export const create = async (_userId: Types.ObjectId, _body: CreateOrderBody) => todo()
export const verifyPayment = async (_query: PaymentCallbackQuery): Promise<string> => todo()
export const listMine = async (_userId: Types.ObjectId, _query: ListQuery) => todo()
export const getMine = async (_userId: Types.ObjectId, _id: string) => todo()
export const cancelByUser = async (_userId: Types.ObjectId, _id: string, _reason?: string) => todo()
export const confirmDelivered = async (_userId: Types.ObjectId, _id: string) => todo()
export const listAdmin = async (_query: AdminListQuery) => todo()
export const getAdminById = async (_id: string) => todo()
export const ship = async (_id: string, _body: ShipOrderBody) => todo()
export const cancelByAdmin = async (_id: string, _reason?: string) => todo()
export const cancelItem = async (_id: string, _body: CancelItemBody) => todo()
