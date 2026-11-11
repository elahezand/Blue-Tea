import type { ID } from "./api"
import type { User } from "./user"

export type OrderStatus = "pending" | "paid" | "processing" | "shipped" | "delivered" | "canceled"

export type PaymentMethod = "online" | "cash"

export interface OrderItem {
    _id?: ID
    product: ID
    title?: string
    price: number
    quantity: number
    isCanceled?: boolean
}

export interface ShippingAddress {
    fullName: string
    phone: string
    address: string
    city: string
    postalCode?: string
}

export interface Order {
    _id: ID
    user: ID
    items: OrderItem[]
    totalPrice: number
    status?: OrderStatus
    paymentMethod: PaymentMethod
    isPaid?: boolean
    paidAt?: string
    shippedAt?: string
    deliveredAt?: string
    canceledAt?: string
    shippingAddress?: ShippingAddress
    createdAt?: string
}

export interface OrderWithUser extends Omit<Order, "user"> {
    user: Pick<User, "_id" | "name" | "email"> | null
}

export interface CreateOrderBody {
    paymentMethod: PaymentMethod
    shippingAddress: ShippingAddress
}

export interface CreateOrderResult {
    order: Order
    paymentUrl?: string | null
}

export interface CancelItemBody {
    item: ID
}
