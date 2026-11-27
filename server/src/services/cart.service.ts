import { Types, type FilterQuery } from "mongoose"
import Cart, { CART_STATUSES, type ICart, type ICartItem } from "../models/Cart.js"
import Discount from "../models/Discount.js"
import Product from "../models/Product.js"
import type { AddToCartBody, SyncCartBody } from "../schemas/cart.schema.js"
import type { AdminListQuery } from "../schemas/common.schema.js"
import { AppError } from "../utils/AppError.js"
import { buildListQuery } from "../utils/buildListQuery.js"
import { paginate } from "../utils/paginate.js"

const MAX_LINES = 50
const MAX_QUANTITY = 50
const MAX_ATTEMPTS = 5
type CartState = { items: ICartItem[]; discountCode: string | null }

const getProducts = (items: ICartItem[]) =>
    Product.find({ _id: { $in: items.map(item => item.product) } })
        .select("name img price stock variants isAvailable").lean()


const getDiscount = async (code: string | null, subtotal: number) => {
    if (!code) return { amount: 0, issue: null }
    const discount = await Discount.findOne({ code, active: true }).lean()
    if (!discount || (discount.expiresAt && discount.expiresAt <= new Date())) {
        return { amount: 0, issue: "This discount code is invalid or expired" }
    }
    if (discount.usageLimit != null && discount.usedCount >= discount.usageLimit) {
        return { amount: 0, issue: "This discount code has reached its usage limit" }
    }
    if (subtotal < Math.round(discount.minimumSubtotal * 100)) {
        return { amount: 0, issue: "The cart total is below the minimum for this code" }
    }
    const amount = discount.kind === "percent"
        ? Math.round(subtotal * discount.value / 100)
        : Math.round(discount.value * 100)
    return { amount: Math.min(subtotal, amount), issue: null }
}


const quote = async ({ items, discountCode }: CartState) => {
    const products = await getProducts(items)
    let subtotal = 0

    const lines = items.flatMap(item => {
        const product = products.find(entry => entry._id.equals(item.product))
        if (!product) return []

        const unitPrice = Math.round(product.price * item.grams)
        const lineTotal = unitPrice * item.quantity
        subtotal += lineTotal
        return [{
            _id: item._id,
            product: { _id: product._id, name: product.name, img: product.img },
            grams: item.grams,
            quantity: item.quantity,
            unitPrice: unitPrice / 100,
            subtotal: lineTotal / 100,
        }]
    })
    const { amount, issue } = await getDiscount(discountCode, subtotal)
    return {
        items: lines,
        totalCount: lines.reduce((total, item) => total + item.quantity, 0),
        totalPrice: subtotal / 100,
        discountCode,
        discount: amount / 100,
        discountIssue: issue,
        finalPrice: (subtotal - amount) / 100,
    }
}

const checkStock = async (items: ICartItem[], changedProducts: Set<string>) => {
    const changed = items.filter(item => changedProducts.has(String(item.product)))
    if (!changed.length) return
    const products = await getProducts(changed)
  
    const packsByProduct = new Map<string, number>()
   
    for (const item of changed) {
        const id = String(item.product)
        const product = products.find(entry => entry._id.equals(item.product))
        if (!product?.isAvailable || !product.variants.some(variant => variant.grams === item.grams)) {
            throw new AppError("This product or pack size is unavailable", 409)
        }
        const packs = (packsByProduct.get(id) ?? 0) + item.quantity
        if (packs > product.stock) throw new AppError("There isn't enough stock for this product", 409)
        packsByProduct.set(id, packs)
    }
}

const activeCart = (user: Types.ObjectId) => Cart.findOne({ user, status: "active" }).lean()

const mutate = async (user: Types.ObjectId, change: (cart: CartState) => Promise<void> | void) => {
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        const current = await activeCart(user)
        const now = new Date()
        if (current?.lockedUntil && current.lockedUntil > now) {
            throw new AppError("This cart has a checkout in progress", 409)
        }

        const state: CartState = {
            items: (current?.items ?? []).map(({ _id, product, grams, quantity }) => ({ _id, product, grams, quantity })),
            discountCode: current?.discountCode ?? null,
        }
        await change(state)
        if (state.items.length > MAX_LINES) throw new AppError("Your cart is too big", 422)
        const priced = await quote(state)

        if (!current) {
            if (!state.items.length && !state.discountCode) return priced
            try {
                await Cart.create({ user, ...state })
                return priced
            } catch (error) {
                if (typeof error === "object" && error && "code" in error && error.code === 11000) continue
                throw error
            }
        }

        const result = await Cart.updateOne({
            _id: current._id,
            status: "active",
            revision: current.revision ?? null,
            $or: [{ lockedUntil: null }, { lockedUntil: { $lte: now } }],
        }, { $set: state, $inc: { revision: 1 } }, { runValidators: true })
        if (result.matchedCount) return priced
    }
    throw new AppError("Your cart changed. Please try again.", 409)
}

export const getCart = async (user: Types.ObjectId) =>
    quote(await activeCart(user) ?? { items: [], discountCode: null })

export const addItem = (user: Types.ObjectId, input: AddToCartBody) => mutate(user, async state => {
    const item = state.items.find(line => line.product.equals(input.product) && line.grams === input.grams)
    const quantity = (item?.quantity ?? 0) + input.quantity
    if (quantity > MAX_QUANTITY) throw new AppError("Up to 50 of one item", 422)

    if (quantity <= 0) {
        state.items = state.items.filter(line => line !== item)
    } else if (item) {
        item.quantity = quantity
    } else {
        state.items.push({ ...input, product: new Types.ObjectId(input.product), _id: new Types.ObjectId() })
    }

    if (input.quantity > 0) await checkStock(state.items, new Set([String(new Types.ObjectId(input.product))]))
})

export const removeItem = (user: Types.ObjectId, id: string) => mutate(user, state => {
    state.items = state.items.filter(item => !item._id.equals(id))
})

export const clear = (user: Types.ObjectId) => mutate(user, state => {
    state.items = []
    state.discountCode = null
})

export const applyDiscount = (user: Types.ObjectId, code: string) => mutate(user, async state => {
    if (!state.items.length) throw new AppError("Add an item before applying a discount", 422)
    const priced = await quote({ ...state, discountCode: code })
    if (priced.discountIssue) throw new AppError(priced.discountIssue, 409, { code: priced.discountIssue })
    state.discountCode = code
})

const lineKey = ({ product, grams }: { product: Types.ObjectId; grams: number }) => `${product}:${grams}`

export const sync = (user: Types.ObjectId, items: SyncCartBody["items"]) => mutate(user, async state => {
    const merged = new Map(state.items.map(item => [lineKey(item), item]))
    const changedProducts = new Set<string>()
    for (const input of items) {
        const product = new Types.ObjectId(input.product)
        const key = lineKey({ product, grams: input.grams })
        merged.set(key, { ...input, product, _id: merged.get(key)?._id ?? new Types.ObjectId() })
        changedProducts.add(String(product))
    }
    state.items = [...merged.values()]
    await checkStock(state.items, changedProducts)
})

export const listAdmin = async ({ cursor, limit, status, from, to, preset }: AdminListQuery) => {
    const page = await paginate(Cart, {
        cursor,
        limit,
        filters: buildListQuery<ICart>({ status, from, to, preset }, { statuses: CART_STATUSES, dateField: "createdAt" }),
        sort: { updatedAt: -1 },
        populate: { path: "user", select: "name phone" },
    })
    const data = await Promise.all(page.data.map(async cart => ({
        ...await quote(cart), _id: cart._id, user: cart.user, status: cart.status, updatedAt: cart.updatedAt,
    })))
    return { data, pagination: page.pagination }
}

export const remove = async (id: string) => {
    const filters: FilterQuery<ICart> = { _id: id, $or: [{ lockedUntil: null }, { lockedUntil: { $lte: new Date() } }] }
    const result = await Cart.deleteOne(filters)
    if (result.deletedCount) return
    if (await Cart.exists({ _id: id })) throw new AppError("This cart has a checkout in progress", 409)
    throw new AppError("Cart not found", 404)
}
