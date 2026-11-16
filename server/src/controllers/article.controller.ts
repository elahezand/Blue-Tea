import type { NextFunction, Request, Response } from "express"
import type { ArticleBody, UpdateArticleBody } from "../schemas/article.schema.js"
import type { AdminListQuery, ListQuery } from "../schemas/common.schema.js"
import * as articleService from "../services/article.service.js"
import { send, sendList, sendMessage } from "../utils/response.js"

type IdParams = { id: string }

export const getArticles = async (req: Request<{}, any, any, ListQuery>, res: Response, next: NextFunction) => {
    try {
        const { data, pagination } = await articleService.list(req.query)
        sendList(res, data, pagination)
    } catch (error) {
        next(error)
    }
}

export const getArticle = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    try {
        send(res, await articleService.getById(req.params.id))
    } catch (error) {
        next(error)
    }
}

export const addView = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    try {
        await articleService.addView(req.params.id, req.ip ?? "unknown")
        sendMessage(res, "Counted")
    } catch (error) {
        next(error)
    }
}

export const getAdminArticles = async (req: Request<{}, any, any, AdminListQuery>, res: Response, next: NextFunction) => {
    try {
        const { data, pagination } = await articleService.listAdmin(req.query)
        sendList(res, data, pagination)
    } catch (error) {
        next(error)
    }
}

export const getAdminArticle = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    try {
        send(res, await articleService.getAdminById(req.params.id))
    } catch (error) {
        next(error)
    }
}

export const createArticle = async (req: Request<{}, any, ArticleBody>, res: Response, next: NextFunction) => {
    try {
        send(res, await articleService.create(req.body, req.file), 201)
    } catch (error) {
        next(error)
    }
}

export const updateArticle = async (req: Request<IdParams, any, UpdateArticleBody>, res: Response, next: NextFunction) => {
    try {
        send(res, await articleService.update(req.params.id, req.body, req.file))
    } catch (error) {
        next(error)
    }
}

export const removeArticle = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    try {
        await articleService.remove(req.params.id)
        sendMessage(res, "Article deleted")
    } catch (error) {
        next(error)
    }
}
