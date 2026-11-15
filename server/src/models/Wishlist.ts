import { Schema, model, type Types } from "mongoose"

export interface IWishlist {
    user: Types.ObjectId
    products: Types.ObjectId[]
    createdAt: Date
    updatedAt: Date
}

const wishlistSchema = new Schema<IWishlist>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
}, { timestamps: true })

const Wishlist = model<IWishlist>("Wishlist", wishlistSchema)

export default Wishlist
