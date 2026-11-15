import { Router } from "express"
import Product from "../models/Product.js"
import Cart from "../models/Cart.js"
import { requireAuth } from "../middlewares/auth.js"
import { DISCOUNT_CODES } from "../config/env.js"
import { asyncHandler, httpError, isObjectId, send, sendMessage } from "../utils/http.js"
import { cartResponse, findOrCreateCart } from "../utils/cart.js"

// Only for logged-in users. A guest's cart is in the browser (localStorage) and comes here via /cart/sync.
const router = Router()
router.use(requireAuth)

const checkGrams = (grams) => {
    const g = Number(grams)
    if (!Number.isInteger(g) || g < 1 || g > 5000) throw httpError(422, "Choose a weight", { grams: "Choose a weight" })
    return g
}

/** adds packs to a line (or makes a new line); a negative quantity takes packs away, 0 removes the line */
const addToLine = (cart, productId, grams, quantity) => {
    const line = cart.items.find((i) => String(i.product) === String(productId) && i.grams === grams)
    if (line) {
        line.quantity += quantity
        if (line.quantity <= 0) cart.items.pull(line._id)
    } else if (quantity > 0) {
        cart.items.push({ product: productId, grams, quantity })
    }
}

// GET /cart
router.get("/", asyncHandler(async (req, res) => {
    send(res, await cartResponse(await findOrCreateCart(req.user._id)))
}))

// POST /cart/items { product, grams, quantity }  (quantity -1 = the − button)
router.post("/items", asyncHandler(async (req, res) => {
    const { product, quantity = 1 } = req.body || {}
    const grams = checkGrams(req.body?.grams)
    const qty = Number(quantity)
    if (!Number.isInteger(qty) || qty === 0 || Math.abs(qty) > 50) throw httpError(422, "Wrong quantity")
    if (!isObjectId(product)) throw httpError(404, "Product not found")
    const found = await Product.findById(product)
    if (!found || found.isAvailable === false) throw httpError(404, "This product is not available")

    const cart = await findOrCreateCart(req.user._id)
    addToLine(cart, found._id, grams, qty)
    await cart.save()
    send(res, await cartResponse(cart))
}))

// DELETE /cart/items/:itemId -> one line
router.delete("/items/:itemId", asyncHandler(async (req, res) => {
    const cart = await findOrCreateCart(req.user._id)
    cart.items.pull(req.params.itemId)
    await cart.save()
    send(res, await cartResponse(cart))
}))

// DELETE /cart/items -> every line, the cart (and its discount code) stays
router.delete("/items", asyncHandler(async (req, res) => {
    const cart = await findOrCreateCart(req.user._id)
    cart.items = []
    await cart.save()
    send(res, await cartResponse(cart))
}))

// DELETE /cart -> the whole cart is removed (lines + discount code)
router.delete("/", asyncHandler(async (req, res) => {
    await Cart.deleteOne({ user: req.user._id })
    sendMessage(res, "Cart removed")
}))

// POST /cart/discount { code }
router.post("/discount", asyncHandler(async (req, res) => {
    const code = String(req.body?.code || "").trim().toUpperCase()
    if (!DISCOUNT_CODES[code]) throw httpError(400, "This code is not valid")
    const cart = await findOrCreateCart(req.user._id)
    if (!cart.items.length) throw httpError(400, "Add something to your cart first")
    cart.discountCode = code
    await cart.save()
    send(res, await cartResponse(cart))
}))

// POST /cart/sync { items: [{ product, grams, quantity }] } -> the guest cart is added to the user's cart after login
router.post("/sync", asyncHandler(async (req, res) => {
    const items = Array.isArray(req.body?.items) ? req.body.items.slice(0, 50) : []
    const ids = items.map((i) => i.product).filter(isObjectId)
    const available = new Set((await Product.find({ _id: { $in: ids }, isAvailable: { $ne: false } }, "_id")).map((p) => String(p._id)))

    const cart = await findOrCreateCart(req.user._id)
    for (const item of items) {
        const grams = Number(item.grams)
        const quantity = Number(item.quantity)
        // anything wrong in localStorage is just skipped
        if (!available.has(String(item.product)) || !Number.isInteger(grams) || grams < 1 || grams > 5000) continue
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) continue
        addToLine(cart, item.product, grams, quantity)
    }
    await cart.save()
    send(res, await cartResponse(cart))
}))

export default router
