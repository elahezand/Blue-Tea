import { Router } from "express"
import * as auth from "../controllers/auth.controller.js"
import { optionalAuth } from "../middlewares/auth.js"
import { byIp, byPhone, rateLimit } from "../middlewares/rateLimit.js"
import { validate } from "../middlewares/validate.js"
import { sendCodeSchema, verifyCodeSchema } from "../schemas/auth.schema.js"

const router = Router()

const sendCodeLimits = [
    rateLimit({ name: "send-code:phone", max: 1, windowSec: 60, key: byPhone, message: "Please wait a minute before asking for a new code" }),
    rateLimit({ name: "send-code:phone-hour", max: 5, windowSec: 3600, key: byPhone }),
    rateLimit({ name: "send-code:ip", max: 20, windowSec: 3600, key: byIp }),
]

const verifyCodeLimits = [
    rateLimit({ name: "verify-code:phone", max: 5, windowSec: 600, key: byPhone, message: "Too many wrong codes. Ask for a new code." }),
    rateLimit({ name: "verify-code:ip", max: 30, windowSec: 600, key: byIp }),
]

router.post("/send-code", validate({ body: sendCodeSchema }), ...sendCodeLimits, auth.sendCode)
router.post("/verify-code", validate({ body: verifyCodeSchema }), ...verifyCodeLimits, auth.verifyCode)
router.post("/refresh", rateLimit({ name: "refresh", max: 60, windowSec: 60 }), auth.refresh)
router.post("/signout", optionalAuth, auth.signout)

export default router
