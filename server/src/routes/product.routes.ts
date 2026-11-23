import { Router } from "express"
import type { ErrorRequestHandler } from "express"
import * as comment from "../controllers/comment.controller.js"
import * as product from "../controllers/product.controller.js"
import { auth, optionalAuth, requireRole } from "../middlewares/auth.js"
import { cache } from "../middlewares/cache.js"
import { byUser, rateLimit } from "../middlewares/rateLimit.js"
import { fileUrl, upload } from "../middlewares/upload.js"
import { validate } from "../middlewares/validate.js"
import { validateId } from "../middlewares/validateId.js"
import { commentSchema } from "../schemas/comment.schema.js"
import { listQuery } from "../schemas/common.schema.js"
import { adminProductQuery, productQuery, productSchema, updateProductSchema } from "../schemas/product.schema.js"
import { removeUpload } from "../utils/files.js"

const router = Router()
const admin = [auth, requireRole("ADMIN")]
const discardInvalidUpload: ErrorRequestHandler = async (error, req, _res, next) => {
    await removeUpload(fileUrl("products", req.file))
    next(error)
}

router.get("/", validate({ query: productQuery }), cache("products", 300), product.getProducts)
router.get("/admin", ...admin, validate({ query: adminProductQuery }), product.getAdminProducts)
router.get("/admin/:id", ...admin, validateId(), product.getAdminProduct)
router.get("/:id", validateId(), cache("products", 300), product.getProduct)
router.post("/:id/view", validateId(), rateLimit({ name: "product-view", max: 30, windowSec: 60 }), product.addView)

router.get("/:id/comments", validateId(), validate({ query: listQuery }), cache("comments", 300), comment.getProductComments)
router.post(
    "/:id/comments",
    validateId(),
    optionalAuth,
    rateLimit({ name: "comment", max: 5, windowSec: 3600, key: byUser, message: "You have sent too many reviews. Try again later." }),
    validate({ body: commentSchema }),
    comment.createComment,
)

router.post("/", ...admin, upload("products").single("img"), validate({ body: productSchema }), discardInvalidUpload, product.createProduct)
router.put("/:id", ...admin, validateId(), upload("products").single("img"), validate({ body: updateProductSchema }), discardInvalidUpload, product.updateProduct)
router.delete("/:id", ...admin, validateId(), product.removeProduct)

export default router
