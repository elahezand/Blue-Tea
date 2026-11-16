import { Router } from "express"
import * as cart from "../controllers/cart.controller.js"
import { auth, requireRole } from "../middlewares/auth.js"
import { validate } from "../middlewares/validate.js"
import { validateId } from "../middlewares/validateId.js"
import { addToCartSchema, discountSchema, syncCartSchema } from "../schemas/cart.schema.js"
import { adminListQuery } from "../schemas/common.schema.js"

const router = Router()

router.use(auth)

router.get("/", cart.getCart)
router.post("/items", validate({ body: addToCartSchema }), cart.addItem)
router.delete("/items/:id", validateId(), cart.removeItem)
router.delete("/items", cart.clearCart)
router.post("/discount", validate({ body: discountSchema }), cart.applyDiscount)
router.post("/sync", validate({ body: syncCartSchema }), cart.syncCart)

router.get("/admin", requireRole("ADMIN"), validate({ query: adminListQuery }), cart.getAdminCarts)
router.delete("/:id", requireRole("ADMIN"), validateId(), cart.removeCart)

export default router
