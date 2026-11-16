import { Router } from "express"
import * as order from "../controllers/order.controller.js"
import { auth, requireRole } from "../middlewares/auth.js"
import { byUser, rateLimit } from "../middlewares/rateLimit.js"
import { validate } from "../middlewares/validate.js"
import { validateId } from "../middlewares/validateId.js"
import { adminListQuery, listQuery } from "../schemas/common.schema.js"
import { cancelItemSchema, cancelOrderSchema, createOrderSchema, shipOrderSchema } from "../schemas/order.schema.js"

const router = Router()
const admin = [auth, requireRole("ADMIN")]

router.get("/payment/callback", order.paymentCallback)

router.post("/", auth, rateLimit({ name: "create-order", max: 10, windowSec: 600, key: byUser }), validate({ body: createOrderSchema }), order.createOrder)
router.get("/me", auth, validate({ query: listQuery }), order.getMyOrders)
router.get("/me/:id", auth, validateId(), order.getMyOrder)
router.patch("/me/cancel/:id", auth, validateId(), validate({ body: cancelOrderSchema }), order.cancelMyOrder)
router.patch("/me/delivered/:id", auth, validateId(), order.confirmDelivered)

router.get("/admin", ...admin, validate({ query: adminListQuery }), order.getAdminOrders)
router.get("/admin/:id", ...admin, validateId(), order.getAdminOrder)
router.patch("/ship/:id", ...admin, validateId(), validate({ body: shipOrderSchema }), order.shipOrder)
router.patch("/cancel/:id", ...admin, validateId(), validate({ body: cancelOrderSchema }), order.cancelOrder)
router.patch("/cancel-item/:id", ...admin, validateId(), validate({ body: cancelItemSchema }), order.cancelOrderItem)

export default router
