import type { Types } from "mongoose"
import type { AdminListQuery, ListQuery } from "../schemas/common.schema.js"
import type { AdminUpdateReservationBody, ReservationBody, UpdateReservationBody } from "../schemas/reservation.schema.js"
import { AppError } from "../utils/AppError.js"

const todo = (): never => {
    throw new AppError("Not implemented yet", 501)
}

export const create = async (_userId: Types.ObjectId, _body: ReservationBody) => todo()
export const listMine = async (_userId: Types.ObjectId, _query: ListQuery) => todo()
export const updateMine = async (_userId: Types.ObjectId, _id: string, _body: UpdateReservationBody) => todo()
export const cancelByUser = async (_userId: Types.ObjectId, _id: string) => todo()
export const listAdmin = async (_query: AdminListQuery) => todo()
export const updateByAdmin = async (_id: string, _body: AdminUpdateReservationBody) => todo()
export const cancelByAdmin = async (_id: string, _reason: string) => todo()
