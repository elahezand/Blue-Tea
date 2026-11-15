import { Router } from "express"
import Product from "../models/Product.js"
import Wishlist from "../models/Wishlist.js"
import { requireAuth } from "../middlewares/auth.js"
import { paginate } from "../utils/paginate.js"
import { asyncHandler, httpError, isObjectId, sendList, sendMessage } from "../utils/http.js"

const router = Router()
router.use(requireAuth)

const findOrCreate = async (userId) =>
    (await Wishlist.findOne({ user: userId })) || Wishlist.create({ user: userId, products: [] })

// GET /wishlist?limit&cursor -> the saved products
router.get("/", asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).lean()
    sendList(res, await paginate(Product.find({ _id: { $in: wishlist?.products ?? [] } }).sort({ _id: -1 }), req.query))
}))

// POST /wishlist { product }
router.post("/", asyncHandler(async (req, res) => {
    const { product } = req.body || {}
    if (!isObjectId(product) || !(await Product.exists({ _id: product }))) throw httpError(404, "Product not found")
    const wishlist = await findOrCreate(req.user._id)
    wishlist.products.addToSet(product) // saving twice is fine
    await wishlist.save()
    sendMessage(res, "Saved", 201)
}))

// DELETE /wishlist/:productId
router.delete("/:productId", asyncHandler(async (req, res) => {
    await Wishlist.updateOne({ user: req.user._id }, { $pull: { products: req.params.productId } })
    sendMessage(res, "Removed")
}))

export default router
