import { Router } from "express"
import * as notification from "../controllers/notification.controller.js"
import { auth, requireRole } from "../middlewares/auth.js"
import { validate } from "../middlewares/validate.js"
import { validateId } from "../middlewares/validateId.js"
import { notificationListQuery, markReadSchema, createNotificationSchema } from "../schemas/notification.schema.js"

const router = Router()

router.use(auth)

router.get("/me", validate({ query: notificationListQuery }), notification.getNotifications)
router.post("/read", validate({ body: markReadSchema }), notification.markRead)
router.get("/recipients", requireRole("ADMIN"), notification.getRecipients)
router.post("/", requireRole("ADMIN"), validate({ body: createNotificationSchema }), notification.post)
router.delete("/:id", validateId(), notification.remove)

export default router
