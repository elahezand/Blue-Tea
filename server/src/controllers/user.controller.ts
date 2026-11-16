import type { NextFunction, Request, Response } from "express"
import type { AdminListQuery } from "../schemas/common.schema.js"
import type { BanUserBody, CreateUserBody, ProfileBody } from "../schemas/user.schema.js"
import * as userService from "../services/user.service.js"
import { getUser } from "../utils/request.js"
import { send, sendList, sendMessage } from "../utils/response.js"

type IdParams = { id: string }

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        send(res, getUser(req))
    } catch (error) {
        next(error)
    }
}

export const updateProfile = async (req: Request<{}, any, ProfileBody>, res: Response, next: NextFunction) => {
    try {
        send(res, await userService.updateProfile(getUser(req)._id, req.body, req.file))
    } catch (error) {
        next(error)
    }
}

export const getUsers = async (req: Request<{}, any, any, AdminListQuery>, res: Response, next: NextFunction) => {
    try {
        const { data, pagination } = await userService.listAdmin(req.query)
        sendList(res, data, pagination)
    } catch (error) {
        next(error)
    }
}

export const getBannedUsers = async (req: Request<{}, any, any, AdminListQuery>, res: Response, next: NextFunction) => {
    try {
        const { data, pagination } = await userService.listAdmin({ ...req.query, status: "banned" })
        sendList(res, data, pagination)
    } catch (error) {
        next(error)
    }
}

export const createUser = async (req: Request<{}, any, CreateUserBody>, res: Response, next: NextFunction) => {
    try {
        send(res, await userService.create(req.body), 201)
    } catch (error) {
        next(error)
    }
}

export const banUser = async (req: Request<IdParams, any, BanUserBody>, res: Response, next: NextFunction) => {
    try {
        send(res, await userService.ban(getUser(req)._id, req.params.id, req.body.reason))
    } catch (error) {
        next(error)
    }
}

export const unbanUser = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    try {
        send(res, await userService.unban(req.params.id))
    } catch (error) {
        next(error)
    }
}

export const removeUser = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    try {
        await userService.remove(getUser(req)._id, req.params.id)
        sendMessage(res, "User deleted")
    } catch (error) {
        next(error)
    }
}
