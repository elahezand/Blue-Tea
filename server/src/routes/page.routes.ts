import { Router } from "express"
import * as page from "../controllers/page.controller.js"
import { auth, requireRole } from "../middlewares/auth.js"
import { cache } from "../middlewares/cache.js"
import { validate } from "../middlewares/validate.js"
import { aboutSchema } from "../schemas/page.schema.js"

const router = Router()

router.get("/about", cache("about", 3600), page.getAbout)
router.put("/about", auth, requireRole("ADMIN"), validate({ body: aboutSchema }), page.updateAbout)

export default router
