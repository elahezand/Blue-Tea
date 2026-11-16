import { Router } from "express"
import * as ticket from "../controllers/ticket.controller.js"
import { auth, requireRole } from "../middlewares/auth.js"
import { byUser, rateLimit } from "../middlewares/rateLimit.js"
import { validate } from "../middlewares/validate.js"
import { validateId } from "../middlewares/validateId.js"
import { adminListQuery, listQuery } from "../schemas/common.schema.js"
import { replyTicketSchema, ticketSchema, updateTicketSchema } from "../schemas/ticket.schema.js"

const router = Router()
const admin = requireRole("ADMIN")

router.use(auth)

router.post("/", rateLimit({ name: "ticket", max: 5, windowSec: 3600, key: byUser }), validate({ body: ticketSchema }), ticket.createTicket)
router.get("/me", validate({ query: listQuery }), ticket.getMyTickets)
router.get("/me/:id", validateId(), ticket.getMyTicket)
router.post("/reply", validate({ body: replyTicketSchema }), ticket.replyTicket)

router.get("/admin", admin, validate({ query: adminListQuery }), ticket.getAdminTickets)
router.get("/admin/stats", admin, ticket.getTicketStats)
router.get("/admin/:id", admin, validateId(), ticket.getAdminTicket)

router.get("/:id/replies", validateId(), validate({ query: listQuery }), ticket.getReplies)
router.put("/:id", validateId(), validate({ body: updateTicketSchema }), ticket.updateTicket)
router.delete("/:id", admin, validateId(), ticket.removeTicket)

export default router
