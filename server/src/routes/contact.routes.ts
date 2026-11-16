import { Router } from "express"
import * as contact from "../controllers/contact.controller.js"
import { auth, optionalAuth, requireRole } from "../middlewares/auth.js"
import { rateLimit } from "../middlewares/rateLimit.js"
import { validate } from "../middlewares/validate.js"
import { adminListQuery, listQuery } from "../schemas/common.schema.js"
import { contactSchema, replyContactSchema } from "../schemas/contact.schema.js"

const router = Router()

router.post("/", optionalAuth, rateLimit({ name: "contact", max: 5, windowSec: 3600 }), validate({ body: contactSchema }), contact.createContact)
router.get("/me", auth, validate({ query: listQuery }), contact.getMyContacts)
router.get("/admin", auth, requireRole("ADMIN"), validate({ query: adminListQuery }), contact.getAdminContacts)
router.post("/reply", auth, requireRole("ADMIN"), validate({ body: replyContactSchema }), contact.replyContact)

export default router
