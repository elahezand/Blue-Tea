import type { NextFunction, Request, Response } from "express"
import type { CategoryBody, UpdateCategoryBody } from "../schemas/category.schema.js"
import type { AdminListQuery } from "../schemas/common.schema.js"
import * as categoryService from "../services/category.service.js"
import { send, sendList, sendMessage } from "../utils/response.js"

type IdParams = { id: string }

export const getCategories = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        send(res, await categoryService.list())
    } catch (error) {
        next(error)
    }
}

export const getCategoryTree = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        send(res, await categoryService.getTree())
    } catch (error) {
        next(error)
    }
}

export const getAdminCategories = async (req: Request<{}, any, any, AdminListQuery>, res: Response, next: NextFunction) => {
    try {
        const { data, pagination } = await categoryService.listAdmin(req.query)
        sendList(res, data, pagination)
    } catch (error) {
        next(error)
    }
}

export const getCategory = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    try {
        send(res, await categoryService.getById(req.params.id))
    } catch (error) {
        next(error)
    }
}

export const createCategory = async (req: Request<{}, any, CategoryBody>, res: Response, next: NextFunction) => {
    try {
        send(res, await categoryService.create(req.body, req.file), 201)
    } catch (error) {
        next(error)
    }
}

export const updateCategory = async (req: Request<IdParams, any, UpdateCategoryBody>, res: Response, next: NextFunction) => {
    try {
        send(res, await categoryService.update(req.params.id, req.body, req.file))
    } catch (error) {
        next(error)
    }
}

export const removeCategory = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    try {
        await categoryService.remove(req.params.id)
        sendMessage(res, "Category deleted")
    } catch (error) {
        next(error)
    }
}
