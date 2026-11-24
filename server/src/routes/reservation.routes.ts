import { Router } from "express"
import * as reservation from "../controllers/reservation.controller.js"
import { auth, requireRole } from "../middlewares/auth.js"
import { byUser, rateLimit } from "../middlewares/rateLimit.js"
import { validate } from "../middlewares/validate.js"
import { validateId } from "../middlewares/validateId.js"
import { adminReservationListQuery, adminUpdateReservationSchema, cancelReservationSchema, myReservationListQuery, reservationSchema, updateReservationSchema } from "../schemas/reservation.schema.js"

const router = Router()
const admin = [auth, requireRole("ADMIN")]

router.post("/", auth, rateLimit({ name: "reservation", max: 5, windowSec: 3600, key: byUser }), validate({ body: reservationSchema }), reservation.createReservation)
router.get("/me", auth, validate({ query: myReservationListQuery }), reservation.getMyReservations)
router.put("/me/:id", auth, validateId(), validate({ body: updateReservationSchema }), reservation.updateMyReservation)
router.patch("/me/cancel/:id", auth, validateId(), reservation.cancelMyReservation)

router.get("/admin", ...admin, validate({ query: adminReservationListQuery }), reservation.getAdminReservations)
router.put("/:id", ...admin, validateId(), validate({ body: adminUpdateReservationSchema }), reservation.updateAdminReservation)
router.patch("/cancel/:id", ...admin, validateId(), validate({ body: cancelReservationSchema }), reservation.cancelAdminReservation)

export default router
