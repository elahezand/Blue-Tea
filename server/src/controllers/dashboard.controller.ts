import type { NextFunction, Request, Response } from "express"
import * as dashboardService from "../services/dashboard.service.js"
import { getUser } from "../utils/request.js"
import { send } from "../utils/response.js"

export const getMyDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        send(res, await dashboardService.getUserDashboard(getUser(req)._id))
    } catch (error) {
        next(error)
    }
}

export const getAdminDashboard = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        send(res, await dashboardService.getAdminDashboard())
    } catch (error) {
        next(error)
    }
}
