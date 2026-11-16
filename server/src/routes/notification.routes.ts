import { Router } from "express"
import * as notification from "../controllers/notification.controller.js"
import { auth, requireRole } from "../middlewares/auth.js"
import { validate } from "../middlewares/validate.js"
import { listQuery } from "../schemas/common.schema.js"
import { markReadSchema } from "../schemas/notification.schema.js"

const router = Router()

router.use(auth)

router.get("/me", validate({ query: listQuery }), notification.getMyNotifications)
router.get("/admin", requireRole("ADMIN"), validate({ query: listQuery }), notification.getAdminNotifications)
router.post("/read", validate({ body: markReadSchema }), notification.markRead)

export default router
