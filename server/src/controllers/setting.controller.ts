import type { NextFunction, Request, Response } from "express"
import type { SettingBody } from "../schemas/setting.schema.js"
import * as settingService from "../services/setting.service.js"
import { send } from "../utils/response.js"

export const getSettings = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        send(res, await settingService.get())
    } catch (error) {
        next(error)
    }
}

export const updateSettings = async (req: Request<{}, any, SettingBody>, res: Response, next: NextFunction) => {
    try {
        send(res, await settingService.update(req.body))
    } catch (error) {
        next(error)
    }
}
