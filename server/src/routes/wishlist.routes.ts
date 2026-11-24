import { Router } from "express"
import * as wishlist from "../controllers/wishlist.controller.js"
import { auth } from "../middlewares/auth.js"
import { validate } from "../middlewares/validate.js"
import { listQuery } from "../schemas/common.schema.js"
import { toggleWishlistSchema } from "../schemas/wishlist.schema.js"

const router = Router()

router.use(auth)

router.get("/", validate({ query: listQuery }), wishlist.getWishlist)
router.get("/ids", wishlist.getWishlistIds)
router.post("/toggle", validate({ body: toggleWishlistSchema }), wishlist.toggleWishlist)

export default router
