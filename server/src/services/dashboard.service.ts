import type { Types } from "mongoose"
import { AppError } from "../utils/AppError.js"

const todo = (): never => {
    throw new AppError("Not implemented yet", 501)
}

export const getUserDashboard = async (_userId: Types.ObjectId) => todo()
export const getAdminDashboard = async () => todo()
