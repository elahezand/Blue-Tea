import { Router } from "express"
import * as article from "../controllers/article.controller.js"
import { auth, requireRole } from "../middlewares/auth.js"
import { cache } from "../middlewares/cache.js"
import { rateLimit } from "../middlewares/rateLimit.js"
import { upload } from "../middlewares/upload.js"
import { validate } from "../middlewares/validate.js"
import { validateId } from "../middlewares/validateId.js"
import { adminListQuery, listQuery } from "../schemas/common.schema.js"
import { articleSchema, updateArticleSchema } from "../schemas/article.schema.js"

const router = Router()
const admin = [auth, requireRole("ADMIN")]

/* ---------- Admin ---------- */

router.get("/admin", ...admin, validate({ query: adminListQuery }), article.getAdminArticles)
router.get("/admin/:id", ...admin, validateId(), article.getAdminArticle)
router.post("/", ...admin, upload("articles").single("cover"), validate({ body: articleSchema }), article.createArticle)
router.put("/:id", ...admin, validateId(), upload("articles").single("cover"), validate({ body: updateArticleSchema }), article.updateArticle)
router.delete("/:id", ...admin, validateId(), article.removeArticle)

/* ---------- Public ---------- */

router.get("/", validate({ query: listQuery }), cache("articles", 300), article.getArticles)
router.get("/:id", validateId(), cache("articles", 300), article.getArticle)
router.post("/:id/view", validateId(), rateLimit({ name: "article-view", max: 30, windowSec: 60 }), article.addView)
router.get("/:id/related", validateId(), validate({ query: listQuery }), cache("articles", 300), article.getRelatedArticles)

export default router