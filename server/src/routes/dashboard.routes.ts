import { Router } from "express"
import * as dashboard from "../controllers/dashboard.controller.js"
import { auth, requireRole } from "../middlewares/auth.js"

const router = Router()

router.use(auth)

router.get("/me", dashboard.getMyDashboard)
router.get("/admin", requireRole("ADMIN"), dashboard.getAdminDashboard)

export default router
