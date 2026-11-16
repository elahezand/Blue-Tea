import type { NextFunction, Request, Response } from "express"
import type { AboutBody } from "../schemas/page.schema.js"
import * as pageService from "../services/page.service.js"
import { send } from "../utils/response.js"

export const getAbout = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        send(res, await pageService.getAbout())
    } catch (error) {
        next(error)
    }
}

export const updateAbout = async (req: Request<{}, any, AboutBody>, res: Response, next: NextFunction) => {
    try {
        send(res, await pageService.updateAbout(req.body))
    } catch (error) {
        next(error)
    }
}
