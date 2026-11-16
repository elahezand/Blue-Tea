import { Router } from "express"
import * as user from "../controllers/user.controller.js"
import { auth, requireRole } from "../middlewares/auth.js"
import { upload } from "../middlewares/upload.js"
import { validate } from "../middlewares/validate.js"
import { validateId } from "../middlewares/validateId.js"
import { adminListQuery } from "../schemas/common.schema.js"
import { banUserSchema, createUserSchema, profileSchema } from "../schemas/user.schema.js"

const router = Router()
const admin = requireRole("ADMIN")

router.use(auth)

router.get("/profile", user.getProfile)
router.patch("/profile", upload("avatars").single("avatar"), validate({ body: profileSchema }), user.updateProfile)

router.get("/", admin, validate({ query: adminListQuery }), user.getUsers)
router.get("/banned", admin, validate({ query: adminListQuery }), user.getBannedUsers)
router.post("/", admin, validate({ body: createUserSchema }), user.createUser)
router.patch("/ban/:id", admin, validateId(), validate({ body: banUserSchema }), user.banUser)
router.patch("/unban/:id", admin, validateId(), user.unbanUser)
router.delete("/:id", admin, validateId(), user.removeUser)

export default router
