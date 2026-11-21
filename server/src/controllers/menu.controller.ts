import type { NextFunction, Request, Response } from "express"
import type { AdminListQuery } from "../schemas/common.schema.js"
import type { MenuItemBody, UpdateMenuItemBody } from "../schemas/menu.schema.js"
import * as menuService from "../services/menu.service.js"
import { send, sendList, sendMessage } from "../utils/response.js"

type IdParams = { id: string }

/* ---------- Public ---------- */

export const getMenu = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        send(res, await menuService.getMenu())
    } catch (error) {
        next(error)
    }
}

/* ---------- Admin ---------- */
export const getAdminMenu = async (req: Request<{}, any, any, AdminListQuery>, res: Response, next: NextFunction) => {
    try {
        const { data, pagination } = await menuService.listAdmin(req.query)
        sendList(res, data, pagination)
    } catch (error) {
        next(error)
    }
}

export const getAdminMenuItem = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    try {
        send(res, await menuService.getById(req.params.id))
    } catch (error) {
        next(error)
    }
}

export const createMenuItem = async (req: Request<{}, any, MenuItemBody>, res: Response, next: NextFunction) => {
    try {
        send(res, await menuService.create(req.body, req.file), 201)
    } catch (error) {
        next(error)
    }
}

export const updateMenuItem = async (req: Request<IdParams, any, UpdateMenuItemBody>, res: Response, next: NextFunction) => {
    try {
        send(res, await menuService.update(req.params.id, req.body, req.file))
    } catch (error) {
        next(error)
    }
}

export const removeMenuItem = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    try {
        await menuService.remove(req.params.id)
        sendMessage(res, "Menu item deleted")
    } catch (error) {
        next(error)
    }
}