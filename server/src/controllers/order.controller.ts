import type { NextFunction, Request, Response } from "express"
import type { AdminListQuery, ListQuery } from "../schemas/common.schema.js"
import { paymentCallbackQuery, type CancelItemBody, type CancelOrderBody, type CreateOrderBody, type ShipOrderBody } from "../schemas/order.schema.js"
import * as orderService from "../services/order.service.js"
import { getUser } from "../utils/request.js"
import { send, sendList } from "../utils/response.js"

type IdParams = { id: string }

export const createOrder = async (req: Request<{}, any, CreateOrderBody>, res: Response, next: NextFunction) => {
    try {
        send(res, await orderService.create(getUser(req)._id, req.body), 201)
    } catch (error) {
        next(error)
    }
}

export const paymentCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.redirect(await orderService.verifyPayment(paymentCallbackQuery.parse(req.query)))
    } catch (error) {
        next(error)
    }
}

export const getMyOrders = async (req: Request<{}, any, any, ListQuery>, res: Response, next: NextFunction) => {
    try {
        const { data, pagination } = await orderService.listMine(getUser(req)._id, req.query)
        sendList(res, data, pagination)
    } catch (error) {
        next(error)
    }
}

export const getMyOrder = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    try {
        send(res, await orderService.getMine(getUser(req)._id, req.params.id))
    } catch (error) {
        next(error)
    }
}

export const cancelMyOrder = async (req: Request<IdParams, any, CancelOrderBody>, res: Response, next: NextFunction) => {
    try {
        send(res, await orderService.cancelByUser(getUser(req)._id, req.params.id, req.body.reason))
    } catch (error) {
        next(error)
    }
}

export const confirmDelivered = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    try {
        send(res, await orderService.confirmDelivered(getUser(req)._id, req.params.id))
    } catch (error) {
        next(error)
    }
}

export const getAdminOrders = async (req: Request<{}, any, any, AdminListQuery>, res: Response, next: NextFunction) => {
    try {
        const { data, pagination } = await orderService.listAdmin(req.query)
        sendList(res, data, pagination)
    } catch (error) {
        next(error)
    }
}

export const getAdminOrder = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    try {
        send(res, await orderService.getAdminById(req.params.id))
    } catch (error) {
        next(error)
    }
}

export const shipOrder = async (req: Request<IdParams, any, ShipOrderBody>, res: Response, next: NextFunction) => {
    try {
        send(res, await orderService.ship(req.params.id, req.body))
    } catch (error) {
        next(error)
    }
}

export const cancelOrder = async (req: Request<IdParams, any, CancelOrderBody>, res: Response, next: NextFunction) => {
    try {
        send(res, await orderService.cancelByAdmin(req.params.id, req.body.reason))
    } catch (error) {
        next(error)
    }
}

export const cancelOrderItem = async (req: Request<IdParams, any, CancelItemBody>, res: Response, next: NextFunction) => {
    try {
        send(res, await orderService.cancelItem(req.params.id, req.body))
    } catch (error) {
        next(error)
    }
}
