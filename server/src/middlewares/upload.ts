import { randomUUID } from "node:crypto"
import { mkdirSync } from "node:fs"
import path from "node:path"
import multer from "multer"
import { UPLOAD_DIR } from "../config/env.js"
import { AppError } from "../utils/AppError.js"

export const IMAGE_TYPES: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024

export const upload = (folder: string) => {
    const dir = path.join(UPLOAD_DIR, folder)
    mkdirSync(dir, { recursive: true })

    return multer({
        storage: multer.diskStorage({
            destination: dir,
            filename: (_req, file, cb) => cb(null, `${randomUUID()}${IMAGE_TYPES[file.mimetype]}`),
        }),
        limits: { fileSize: MAX_IMAGE_SIZE, files: 1 },
        fileFilter: (_req, file, cb) => {
            if (IMAGE_TYPES[file.mimetype]) return cb(null, true)
            cb(new AppError("Only JPG, PNG or WEBP images", 422, { [file.fieldname]: "Only JPG, PNG or WEBP images" }))
        },
    })
}

export const fileUrl = (folder: string, file?: Express.Multer.File) => (file ? `/${UPLOAD_DIR}/${folder}/${file.filename}` : undefined)
