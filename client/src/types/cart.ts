import type { ID } from "./api"
import type { Product } from "./product"
import type { User } from "./user"

export interface CartItem {
    _id: ID
    product: Pick<Product, "_id" | "name"> & { img: string }
    grams: number
    unitPrice: number
    quantity: number
    subtotal: number
}

export interface Cart {
    items: CartItem[]
    totalCount: number
    totalPrice: number
    discountCode?: string | null
    discount?: number
    finalPrice?: number
}

export interface AdminCart extends Cart {
    _id: ID
    user: Pick<User, "_id" | "name" | "phone">
    updatedAt: string
}

export interface AddToCartBody {
    product: ID
    grams: number
    quantity?: number
}

export interface GuestCartItem {
    product: ID
    grams: number
    quantity: number
}
