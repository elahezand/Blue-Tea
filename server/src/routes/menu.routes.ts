import { Router } from "express"
import * as menu from "../controllers/menu.controller.js"
import { auth, requireRole } from "../middlewares/auth.js"
import { cache } from "../middlewares/cache.js"
import { upload } from "../middlewares/upload.js"
import { validate } from "../middlewares/validate.js"
import { validateId } from "../middlewares/validateId.js"
import { adminListQuery } from "../schemas/common.schema.js"
import { menuItemSchema, updateMenuItemSchema } from "../schemas/menu.schema.js"

const router = Router()
const admin = [auth, requireRole("ADMIN")]

/* ---------- Admin ---------- */

router.get("/admin", ...admin, validate({ query: adminListQuery }), menu.getAdminMenu)
router.get("/admin/:id", ...admin, validateId(), menu.getAdminMenuItem)
router.post("/", ...admin, upload("menu").single("img"), validate({ body: menuItemSchema }), menu.createMenuItem)
router.put("/:id", ...admin, validateId(), upload("menu").single("img"), validate({ body: updateMenuItemSchema }), menu.updateMenuItem)
router.delete("/:id", ...admin, validateId(), menu.removeMenuItem)

/* ---------- Public ---------- */

router.get("/", cache("menu", 3600), menu.getMenu)

export default router