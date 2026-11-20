import About from "../models/About.js"
import type { AboutBody } from "../schemas/page.schema.js"
import { AppError } from "../utils/AppError.js"

const todo = (): never => {
    throw new AppError("Not implemented yet", 501)
}

export const getAbout = async () => {
    const about = await About.findOne().lean()
    if (!about) throw new AppError("About page not found", 404)
    return about
}

export const updateAbout = async (_body: AboutBody) => todo()
