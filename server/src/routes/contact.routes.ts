import { Router } from "express"
import * as contact from "../controllers/contact.controller.js"
import { auth, optionalAuth, requireRole } from "../middlewares/auth.js"
import { rateLimit } from "../middlewares/rateLimit.js"
import { validateId } from "../middlewares/validateId.js"
import { validate } from "../middlewares/validate.js"
import { adminListQuery } from "../schemas/common.schema.js"
import { contactSchema, replyContactSchema } from "../schemas/contact.schema.js"

const router = Router()
const admin = [auth, requireRole("ADMIN")]

/* ---------- Admin ---------- */
router.get("/admin", ...admin, validate({ query: adminListQuery }), contact.getAdminContacts)
router.post("/reply", ...admin, validate({ body: replyContactSchema }), contact.replyContact)
router.delete("/admin/:id", ...admin, validateId(), contact.removeContact)
/* ---------- Public ---------- */
router.post("/", optionalAuth, rateLimit({ name: "contact", max: 5, windowSec: 3600 }), validate({ body: contactSchema }), contact.createContact)

export default router