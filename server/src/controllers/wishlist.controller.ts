import type { NextFunction, Request, Response } from "express"
import type { ListQuery } from "../schemas/common.schema.js"
import type { ToggleWishlistBody } from "../schemas/wishlist.schema.js"
import * as wishlistService from "../services/wishlist.service.js"
import { getUser } from "../utils/request.js"
import { send, sendList } from "../utils/response.js"

export const getWishlist = async (req: Request<{}, any, any, ListQuery>, res: Response, next: NextFunction) => {
    try {
        const { data, pagination } = await wishlistService.list(getUser(req)._id, req.query)
        sendList(res, data, pagination)
    } catch (error) {
        next(error)
    }
}

export const toggleWishlist = async (req: Request<{}, any, ToggleWishlistBody>, res: Response, next: NextFunction) => {
    try {
        send(res, await wishlistService.toggle(getUser(req)._id, req.body.product))
    } catch (error) {
        next(error)
    }
}
