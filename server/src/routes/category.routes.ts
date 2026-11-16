import { Router } from "express"
import * as category from "../controllers/category.controller.js"
import { auth, requireRole } from "../middlewares/auth.js"
import { cache } from "../middlewares/cache.js"
import { upload } from "../middlewares/upload.js"
import { validate } from "../middlewares/validate.js"
import { validateId } from "../middlewares/validateId.js"
import { adminListQuery } from "../schemas/common.schema.js"
import { categorySchema, updateCategorySchema } from "../schemas/category.schema.js"

const router = Router()
const admin = [auth, requireRole("ADMIN")]

router.get("/", cache("categories", 3600), category.getCategories)
router.get("/tree", cache("categories", 3600), category.getCategoryTree)
router.get("/admin", ...admin, validate({ query: adminListQuery }), category.getAdminCategories)
router.get("/:id", ...admin, validateId(), category.getCategory)

router.post("/", ...admin, upload("categories").single("img"), validate({ body: categorySchema }), category.createCategory)
router.put("/:id", ...admin, validateId(), upload("categories").single("img"), validate({ body: updateCategorySchema }), category.updateCategory)
router.delete("/:id", ...admin, validateId(), category.removeCategory)

export default router
