import type { NextFunction, Request, Response } from "express"
import type { AdminListQuery, ListQuery } from "../schemas/common.schema.js"
import type { AdminUpdateReservationBody, CancelReservationBody, ReservationBody, UpdateReservationBody } from "../schemas/reservation.schema.js"
import * as reservationService from "../services/reservation.service.js"
import { getUser } from "../utils/request.js"
import { send, sendList } from "../utils/response.js"

type IdParams = { id: string }

export const createReservation = async (req: Request<{}, any, ReservationBody>, res: Response, next: NextFunction) => {
    try {
        send(res, await reservationService.create(getUser(req)._id, req.body), 201)
    } catch (error) {
        next(error)
    }
}

export const getMyReservations = async (req: Request<{}, any, any, ListQuery>, res: Response, next: NextFunction) => {
    try {
        const { data, pagination } = await reservationService.listMine(getUser(req)._id, req.query)
        sendList(res, data, pagination)
    } catch (error) {
        next(error)
    }
}

export const updateMyReservation = async (req: Request<IdParams, any, UpdateReservationBody>, res: Response, next: NextFunction) => {
    try {
        send(res, await reservationService.updateMine(getUser(req)._id, req.params.id, req.body))
    } catch (error) {
        next(error)
    }
}

export const cancelMyReservation = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    try {
        send(res, await reservationService.cancelByUser(getUser(req)._id, req.params.id))
    } catch (error) {
        next(error)
    }
}

export const getAdminReservations = async (req: Request<{}, any, any, AdminListQuery>, res: Response, next: NextFunction) => {
    try {
        const { data, pagination } = await reservationService.listAdmin(req.query)
        sendList(res, data, pagination)
    } catch (error) {
        next(error)
    }
}

export const updateReservation = async (req: Request<IdParams, any, AdminUpdateReservationBody>, res: Response, next: NextFunction) => {
    try {
        send(res, await reservationService.updateByAdmin(req.params.id, req.body))
    } catch (error) {
        next(error)
    }
}

export const cancelReservation = async (req: Request<IdParams, any, CancelReservationBody>, res: Response, next: NextFunction) => {
    try {
        send(res, await reservationService.cancelByAdmin(req.params.id, req.body.reason))
    } catch (error) {
        next(error)
    }
}
