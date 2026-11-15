import Cart from "../models/Cart.js"
import { BASE_GRAMS, DISCOUNT_CODES } from "../config/env.js"

const round = (n) => Math.round(n * 100) / 100

// img can be one string or a list (older products)
const firstImage = (img) => (Array.isArray(img) ? img[0] : img) || ""

export const findOrCreateCart = async (userId) =>
    (await Cart.findOne({ user: userId })) || Cart.create({ user: userId, items: [] })

export const cartResponse = async (cart) => {
    await cart.populate("items.product", "name img price")

    const items = cart.items
        .filter((line) => line.product) // the product was deleted meanwhile
        .map((line) => {
            const unitPrice = round((line.product.price * line.grams) / BASE_GRAMS)
            return {
                _id: line._id,
                product: { _id: line.product._id, name: line.product.name, img: firstImage(line.product.img) },
                grams: line.grams,
                unitPrice,
                quantity: line.quantity,
                subtotal: round(unitPrice * line.quantity),
            }
        })

    const totalPrice = round(items.reduce((sum, i) => sum + i.subtotal, 0))
    const percent = cart.discountCode ? DISCOUNT_CODES[cart.discountCode] || 0 : 0
    const discount = round((totalPrice * percent) / 100)

    return {
        items,
        totalCount: items.reduce((sum, i) => sum + i.quantity, 0),
        totalPrice,
        discountCode: percent ? cart.discountCode : null,
        discount,
        finalPrice: round(totalPrice - discount),
    }
}
