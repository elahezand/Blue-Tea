import type { NextFunction, Request, Response } from "express"
import type { ListQuery } from "../schemas/common.schema.js"
import type { AdminTicketListQuery, MyTicketListQuery, ReplyTicketBody, TicketBody, UpdateTicketBody } from "../schemas/ticket.schema.js"
import * as ticketService from "../services/ticket.service.js"
import { getUser } from "../utils/request.js"
import { send, sendList, sendMessage } from "../utils/response.js"

type IdParams = { id: string }

export const createTicket = async (req: Request<{}, any, TicketBody>, res: Response, next: NextFunction) => {
    try {
        send(res, await ticketService.create(getUser(req)._id, req.body), 201)
    } catch (error) {
        next(error)
    }
}

export const getMyTickets = async (req: Request<{}, any, any, MyTicketListQuery>, res: Response, next: NextFunction) => {
    try {
        const { data, pagination } = await ticketService.listMine(getUser(req)._id, req.query)
        sendList(res, data, pagination)
    } catch (error) {
        next(error)
    }
}

export const getMyTicket = async (req: Request<IdParams, unknown, unknown, ListQuery>, res: Response, next: NextFunction) => {
    try {
        send(res, await ticketService.getMine(getUser(req)._id, req.params.id, req.query))
    } catch (error) {
        next(error)
    }
}

export const replyTicket = async (req: Request<{}, any, ReplyTicketBody>, res: Response, next: NextFunction) => {
    try {
        send(res, await ticketService.reply(getUser(req), req.body), 201)
    } catch (error) {
        next(error)
    }
}

export const updateTicket = async (req: Request<IdParams, any, UpdateTicketBody>, res: Response, next: NextFunction) => {
    try {
        send(res, await ticketService.update(getUser(req), req.params.id, req.body))
    } catch (error) {
        next(error)
    }
}

export const getAdminTickets = async (req: Request<{}, any, any, AdminTicketListQuery>, res: Response, next: NextFunction) => {
    try {
        const { data, pagination } = await ticketService.listAdmin(req.query)
        sendList(res, data, pagination)
    } catch (error) {
        next(error)
    }
}
export const getAdminTicket = async (req: Request<IdParams, unknown, unknown, ListQuery>, res: Response, next: NextFunction) => {
    try {
        send(res, await ticketService.getAdminById(req.params.id, req.query))
    } catch (error) {
        next(error)
    }
}

export const getTicketStats = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        send(res, await ticketService.getStats())
    } catch (error) {
        next(error)
    }
}
export const removeTicket = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    try {
        await ticketService.remove(req.params.id)
        sendMessage(res, "Ticket deleted")
    } catch (error) {
        next(error)
    }
}
