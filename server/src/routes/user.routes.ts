import { Router } from "express"
import type { ErrorRequestHandler } from "express"
import * as user from "../controllers/user.controller.js"
import { auth, requireRole } from "../middlewares/auth.js"
import { fileUrl, upload } from "../middlewares/upload.js"
import { validate } from "../middlewares/validate.js"
import { validateId } from "../middlewares/validateId.js"
import { adminUserListQuery, banUserSchema, createUserSchema, profileSchema } from "../schemas/user.schema.js"
import { removeUpload } from "../utils/files.js"

const router = Router()
const admin = requireRole("ADMIN")
const discardInvalidAvatar: ErrorRequestHandler = async (error, req, _res, next) => {
    await removeUpload(fileUrl("avatars", req.file))
    next(error)
}

router.use(auth)

router.get("/profile", user.getProfile)
router.patch("/profile", upload("avatars").single("avatar"), validate({ body: profileSchema }), discardInvalidAvatar, user.updateProfile)

router.get("/", admin, validate({ query: adminUserListQuery }), user.getUsers)
router.get("/banned", admin, validate({ query: adminUserListQuery }), user.getBannedUsers)
router.post("/", admin, validate({ body: createUserSchema }), user.createUser)
router.patch("/ban/:id", admin, validateId(), validate({ body: banUserSchema }), user.banUser)
router.patch("/unban/:id", admin, validateId(), user.unbanUser)
router.delete("/:id", admin, validateId(), user.removeUser)

export default router
