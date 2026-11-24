import { Types } from "mongoose"
import Product, { type IProduct } from "../models/Product.js"
import Wishlist from "../models/Wishlist.js"
import type { ListQuery } from "../schemas/common.schema.js"
import { AppError } from "../utils/AppError.js"
import { buildListQuery } from "../utils/buildListQuery.js"
import { paginate } from "../utils/paginate.js"
import { toPublic } from "./product.service.js"

const savedProducts = async (user: Types.ObjectId) => {
    const wishlist = await Wishlist.findOne({ user }).select("products").lean()
    return wishlist?.products ?? []
}

export const listIds = async (user: Types.ObjectId) => (await savedProducts(user)).map(String)

export const list = async (user: Types.ObjectId, { limit, cursor, q }: ListQuery) => {
    const products = await savedProducts(user)
    const { data, pagination } = await paginate(Product, {
        limit,
        cursor,
        filters: buildListQuery<IProduct>({ q }, {
            base: { _id: { $in: products }, isAvailable: true },
            search: ["name", "tags"],
        }),
        select: "-longDescription",
    })
    return { data: data.map(toPublic), pagination }
}

export const toggle = async (user: Types.ObjectId, productId: string) => {
    const product = new Types.ObjectId(productId)
    if (!(await Product.exists({ _id: product, isAvailable: true }))) {
        const removed = await Wishlist.updateOne({ user, products: product }, { $pull: { products: product } })
        if (removed.modifiedCount === 0) throw new AppError("Product is unavailable", 404)
        return { saved: false }
    }

    const products = { $ifNull: ["$products", []] }
    const update = [{
        $set: {
            products: {
                $cond: [
                    { $in: [product, products] },
                    { $filter: { input: products, cond: { $ne: ["$$this", product] } } },
                    { $concatArrays: [products, [product]] },
                ],
            },
            createdAt: { $ifNull: ["$createdAt", "$$NOW"] },
        },
    }]

    const toggleProduct = (upsert: boolean) =>
        Wishlist.findOneAndUpdate({ user }, update, { upsert, new: true, updatePipeline: true }).lean()

    let wishlist
    try {
        wishlist = await toggleProduct(true)
    } catch (error) {
        if (!(typeof error === "object" && error && "code" in error && error.code === 11000)) throw error
        wishlist = await toggleProduct(false)
    }
    if (!wishlist) throw new AppError("Couldn't update your favorites", 409)
    return { saved: wishlist.products.some((id) => id.equals(product)) }
}
