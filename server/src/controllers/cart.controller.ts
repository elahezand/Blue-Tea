import type { NextFunction, Request, Response } from "express"
import type { AddToCartBody, DiscountBody, SyncCartBody } from "../schemas/cart.schema.js"
import type { AdminListQuery } from "../schemas/common.schema.js"
import * as cartService from "../services/cart.service.js"
import { getUser } from "../utils/request.js"
import { send, sendList, sendMessage } from "../utils/response.js"

type IdParams = { id: string }

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        send(res, await cartService.getCart(getUser(req)._id))
    } catch (error) {
        next(error)
    }
}

export const addItem = async (req: Request<{}, any, AddToCartBody>, res: Response, next: NextFunction) => {
    try {
        send(res, await cartService.addItem(getUser(req)._id, req.body))
    } catch (error) {
        next(error)
    }
}

export const removeItem = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    try {
        send(res, await cartService.removeItem(getUser(req)._id, req.params.id))
    } catch (error) {
        next(error)
    }
}

export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        send(res, await cartService.clear(getUser(req)._id))
    } catch (error) {
        next(error)
    }
}

export const applyDiscount = async (req: Request<{}, any, DiscountBody>, res: Response, next: NextFunction) => {
    try {
        send(res, await cartService.applyDiscount(getUser(req)._id, req.body.code))
    } catch (error) {
        next(error)
    }
}

export const syncCart = async (req: Request<{}, any, SyncCartBody>, res: Response, next: NextFunction) => {
    try {
        send(res, await cartService.sync(getUser(req)._id, req.body.items))
    } catch (error) {
        next(error)
    }
}

export const getAdminCarts = async (req: Request<{}, any, any, AdminListQuery>, res: Response, next: NextFunction) => {
    try {
        const { data, pagination } = await cartService.listAdmin(req.query)
        sendList(res, data, pagination)
    } catch (error) {
        next(error)
    }
}

export const removeCart = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    try {
        await cartService.remove(req.params.id)
        sendMessage(res, "Cart deleted")
    } catch (error) {
        next(error)
    }
}
