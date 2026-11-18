import type { NextFunction, Request, Response } from "express"
import type { AdminListQuery } from "../schemas/common.schema.js"
import type { ContactBody, ReplyContactBody } from "../schemas/contact.schema.js"
import * as contactService from "../services/contact.service.js"
import { send, sendList,sendMessage } from "../utils/response.js"

/* ---------- Public ---------- */

export const createContact = async (req: Request<{}, any, ContactBody>, res: Response, next: NextFunction) => {
    try {
        send(res, await contactService.create(req.body, req.user), 201)
    } catch (error) {
        next(error)
    }
}

/* ---------- Admin ---------- */
export const getAdminContacts = async (req: Request<{}, any, any, AdminListQuery>, res: Response, next: NextFunction) => {
    try {
        const { data, pagination } = await contactService.listAdmin(req.query)
        sendList(res, data, pagination)
    } catch (error) {
        next(error)
    }
}

export const replyContact = async (req: Request<{}, any, ReplyContactBody>, res: Response, next: NextFunction) => {
    try {
        send(res, await contactService.reply(req.body))
    } catch (error) {
        next(error)
    }
}
export const removeContact = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        await contactService.remove(req.params.id)
        sendMessage(res, "Message deleted")
    } catch (error) {
        next(error)
    }
}