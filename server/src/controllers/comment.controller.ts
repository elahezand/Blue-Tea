import type { NextFunction, Request, Response } from "express"
import type { CommentBody, RejectCommentBody, ReplyCommentBody, UpdateCommentBody } from "../schemas/comment.schema.js"
import type { AdminListQuery, ListQuery } from "../schemas/common.schema.js"
import * as commentService from "../services/comment.service.js"
import { getUser } from "../utils/request.js"
import { send, sendList, sendMessage } from "../utils/response.js"

type IdParams = { id: string }

/* ---------- Public ---------- */

export const getProductComments = async (req: Request<IdParams, any, any, ListQuery>, res: Response, next: NextFunction) => {
    try {
        const { data, pagination } = await commentService.listForProduct(req.params.id, req.query)
        sendList(res, data, pagination)
    } catch (error) {
        next(error)
    }
}

export const getLatestComments = async (req: Request<{}, any, any, ListQuery>, res: Response, next: NextFunction) => {
    try {
        send(res, await commentService.listLatest(req.query))
    } catch (error) {
        next(error)
    }
}

/* ---------- User ---------- */

export const createComment = async (req: Request<IdParams, any, CommentBody>, res: Response, next: NextFunction) => {
    try {
        send(res, await commentService.create(req.params.id, req.body, req.user), 201)
    } catch (error) {
        next(error)
    }
}

export const getMyComments = async (req: Request<{}, any, any, ListQuery>, res: Response, next: NextFunction) => {
    try {
        const { data, pagination } = await commentService.listMine(getUser(req)._id, req.query)
        sendList(res, data, pagination)
    } catch (error) {
        next(error)
    }
}
/* ---------- Admin ---------- */

export const getAdminComments = async (req: Request<{}, any, any, AdminListQuery>, res: Response, next: NextFunction) => {
    try {
        const { data, pagination } = await commentService.listAdmin(req.query)
        sendList(res, data, pagination)
    } catch (error) {
        next(error)
    }
}

export const acceptComment = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    try {
        send(res, await commentService.accept(req.params.id))
    } catch (error) {
        next(error)
    }
}

export const rejectComment = async (req: Request<IdParams, any, RejectCommentBody>, res: Response, next: NextFunction) => {
    try {
        send(res, await commentService.reject(req.params.id, req.body.reason))
    } catch (error) {
        next(error)
    }
}

export const replyComment = async (req: Request<{}, any, ReplyCommentBody>, res: Response, next: NextFunction) => {
    try {
        send(res, await commentService.reply(getUser(req), req.body), 201)
    } catch (error) {
        next(error)
    }
}

export const removeComment = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    try {
        await commentService.remove(req.params.id)
        sendMessage(res, "Review deleted")
    } catch (error) {
        next(error)
    }
}