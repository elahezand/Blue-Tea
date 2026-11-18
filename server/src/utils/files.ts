import { unlink } from "node:fs/promises"
import path from "node:path"
import { UPLOAD_DIR } from "../config/env.js"

export const removeUpload = async (url?: string | null) => {
    if (!url || !url.startsWith(`/${UPLOAD_DIR}/`)) return
    const file = path.resolve(url.slice(1))
    if (!file.startsWith(path.resolve(UPLOAD_DIR))) return
    await unlink(file).catch(() => undefined)
}