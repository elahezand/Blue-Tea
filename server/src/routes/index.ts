import { Router } from "express"
import articleRoutes from "./article.routes.js"
import authRoutes from "./auth.routes.js"
import cartRoutes from "./cart.routes.js"
import categoryRoutes from "./category.routes.js"
import commentRoutes from "./comment.routes.js"
import contactRoutes from "./contact.routes.js"
import dashboardRoutes from "./dashboard.routes.js"
import menuRoutes from "./menu.routes.js"
import notificationRoutes from "./notification.routes.js"
import orderRoutes from "./order.routes.js"
import productRoutes from "./product.routes.js"
import reservationRoutes from "./reservation.routes.js"
import ticketRoutes from "./ticket.routes.js"
import userRoutes from "./user.routes.js"
import wishlistRoutes from "./wishlist.routes.js"

const router = Router()

router.get("/health", (_req, res) => {
    res.json({ success: true, data: { status: "ok" } })
})

router.use("/auth", authRoutes)
router.use("/articles", articleRoutes)
router.use("/categories", categoryRoutes)
router.use("/products", productRoutes)
router.use("/menu", menuRoutes)
router.use("/cart", cartRoutes)
router.use("/wishlist", wishlistRoutes)
router.use("/orders", orderRoutes)
router.use("/comments", commentRoutes)
router.use("/contacts", contactRoutes)
router.use("/reservations", reservationRoutes)
router.use("/tickets", ticketRoutes)
router.use("/notifications", notificationRoutes)
router.use("/dashboard", dashboardRoutes)
router.use("/users", userRoutes)

export default router
