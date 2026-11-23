import { Router } from "express"
import * as comment from "../controllers/comment.controller.js"
import { auth, requireRole } from "../middlewares/auth.js"
import { cache } from "../middlewares/cache.js"
import { validate } from "../middlewares/validate.js"
import { validateId } from "../middlewares/validateId.js"
import { rejectCommentSchema, replyCommentSchema, updateCommentSchema } from "../schemas/comment.schema.js"
import { adminListQuery, commentListQuery, listQuery } from "../schemas/common.schema.js"

const router = Router()
const admin = [auth, requireRole("ADMIN")]

/* ---------- Admin ---------- */

router.get("/admin", ...admin, validate({ query: adminListQuery }), comment.getAdminComments)
router.patch("/accept/:id", ...admin, validateId(), comment.acceptComment)
router.patch("/reject/:id", ...admin, validateId(), validate({ body: rejectCommentSchema }), comment.rejectComment)
router.post("/reply", ...admin, validate({ body: replyCommentSchema }), comment.replyComment)
router.delete("/admin/:id", ...admin, validateId(), comment.removeComment)

/* ---------- User ---------- */

router.get("/me", auth, validate({ query: commentListQuery }), comment.getMyComments)

/* ---------- Public ---------- */

router.get("/latest", validate({ query: listQuery }), cache("comments", 300), comment.getLatestComments)

export default router
