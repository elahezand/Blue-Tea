import type { SettingBody } from "../schemas/setting.schema.js"
import { AppError } from "../utils/AppError.js"

const todo = (): never => {
    throw new AppError("Not implemented yet", 501)
}

export const get = async () => todo()
export const update = async (_body: SettingBody) => todo()
