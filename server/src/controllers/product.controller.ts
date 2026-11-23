import type { NextFunction, Request, Response } from "express"
import type { AdminProductQuery } from "../schemas/product.schema.js"
import type { ProductBody, ProductQuery, UpdateProductBody } from "../schemas/product.schema.js"
import * as productService from "../services/product.service.js"
import { send, sendList, sendMessage } from "../utils/response.js"

type IdParams = { id: string }

export const getProducts = async (req: Request<{}, any, any, ProductQuery>, res: Response, next: NextFunction) => {
    try {
        const { data, pagination } = await productService.list(req.query)
        sendList(res, data, pagination)
    } catch (error) {
        next(error)
    }
}

export const getProduct = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    try {
        send(res, await productService.getById(req.params.id))
    } catch (error) {
        next(error)
    }
}

export const addView = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    try {
        await productService.addView(req.params.id, (req.ip ?? "unknown"))
        sendMessage(res, "Counted")
    } catch (error) {
        next(error)
    }
}

export const getAdminProducts = async (req: Request<{}, any, any, AdminProductQuery>, res: Response, next: NextFunction) => {
    try {
        const { data, pagination } = await productService.listAdmin(req.query)
        sendList(res, data, pagination)
    } catch (error) {
        next(error)
    }
}

export const getAdminProduct = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    try {
        send(res, await productService.getAdminById(req.params.id))
    } catch (error) {
        next(error)
    }
}

export const createProduct = async (req: Request<{}, any, ProductBody>, res: Response, next: NextFunction) => {
    try {
        send(res, await productService.create(req.body, req.file), 201)
    } catch (error) {
        next(error)
    }
}

export const updateProduct = async (req: Request<IdParams, any, UpdateProductBody>, res: Response, next: NextFunction) => {
    try {
        send(res, await productService.update(req.params.id, req.body, req.file))
    } catch (error) {
        next(error)
    }
}

export const removeProduct = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    try {
        await productService.remove(req.params.id)
        sendMessage(res, "Product deleted")
    } catch (error) {
        next(error)
    }
}
