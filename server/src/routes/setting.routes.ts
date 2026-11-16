import { Router } from "express"
import * as setting from "../controllers/setting.controller.js"
import { auth, requireRole } from "../middlewares/auth.js"
import { validate } from "../middlewares/validate.js"
import { settingSchema } from "../schemas/setting.schema.js"

const router = Router()

router.use(auth, requireRole("ADMIN"))

router.get("/", setting.getSettings)
router.put("/", validate({ body: settingSchema }), setting.updateSettings)

export default router
