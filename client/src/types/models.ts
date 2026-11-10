
export type ID = string

export type Role = "USER" | "ADMIN"

export interface User {
    _id: ID
    name: string
    email: string
    phone?: string
    role: Role
    avatar?: string
    createdAt?: string
}

export interface Category {
    _id: ID
    name: string
    slug: string
    parentId?: ID | null
    img?: string
}

export interface CategoryNode extends Category {
    children: CategoryNode[]
}

/** Tree used by the product forms */
export interface ProductCategoryNode {
    _id: ID
    name: string
    children: ProductCategoryNode[]
}

export interface Product {
    _id: ID
    name: string
    price: number
    shortDescription: string
    longDescription: string
    tags: string[]
    variants: string[]
    category: ID | Category
    img: string | string[]
    score?: number
    stock?: number
    isAvailable?: boolean
    createdAt?: string
    updatedAt?: string
}

export interface MenuItem {
    _id: ID
    name: string
    price: number
    description: string
    category: ID | Category
    img?: string
}

/** One section of the café menu (home page): GET /menu */
export interface MenuSection {
    _id: ID
    name: string
    items: Pick<MenuItem, "_id" | "name" | "description" | "price">[]
}

export interface Article {
    _id: ID
    title: string
    author: string
    shortDescription: string
    content: string
    cover?: string
    features?: string[]
    status?: "publish" | "unpublish"
    date?: string
    createdAt?: string
    updatedAt?: string
}

export interface CommentAnswer {
    _id?: ID
    text: string
    createdAt?: string
}

export interface Comment {
    _id: ID
    username: string
    email: string
    score: number
    body: string
    productID?: ID | Product
    isAccept?: boolean
    answer?: CommentAnswer[]
    date?: string
    createdAt?: string
}

export type OrderStatus = "pending" | "paid" | "processing" | "shipped" | "delivered" | "canceled"

export interface OrderItem {
    product: ID
    title?: string
    price: number
    quantity: number
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
    paymentMethod: "online" | "cash"
    isPaid?: boolean
    paidAt?: string
    shippingAddress?: ShippingAddress
    createdAt?: string
}

export interface Reservation {
    _id: ID
    name: string
    email: string
    phone: string
    date: string
    time: string
    guests: number
    message?: string
    notes?: string
    note?: string
    status?: string
}

export interface Contact {
    _id: ID
    answer?: string | string[]
    name: string
    email: string
    phone: string
    company: string
    body: string
    createdAt?: string
}

export type TicketStatus = "Open" | "Answered" | "Closed"

export interface TicketMessage {
    _id?: ID
    from: "user" | "admin"
    text: string
    createdAt?: string
}

export interface Ticket {
    _id: ID
    user: ID
    subject: string
    department: string
    status: TicketStatus
    messages: TicketMessage[]
    createdAt?: string
    updatedAt?: string
}

export interface CommentWithProduct extends Omit<Comment, "productID"> {
    productID?: Pick<Product, "_id" | "name"> | null
}

export interface OrderWithUser extends Omit<Order, "user"> {
    user: Pick<User, "_id" | "name" | "email"> | null
}

export interface TicketWithUser extends Omit<Ticket, "user"> {
    user: Pick<User, "_id" | "name" | "email"> | null
}

export interface TicketStats {
    open: number
    answered: number
    closed: number
}

export type NotificationType = "ticket" | "comment" | "reservation" | "order" | "message"

export interface Notification {
    id: string
    type: NotificationType
    title: string
    text?: string
    href: string
    time?: string
    read?: boolean
}

export interface DashboardStats {
    orderCount: number
    revenue: number
    latestOrders: OrderWithUser[]
    recentReservations: Reservation[]
    messageCount: number
}

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
    /** price of the items, before the discount */
    totalPrice: number
    /** discount code in use, if any */
    discountCode?: string | null
    /** money taken off by the discount */
    discount?: number
    /** what the user pays: totalPrice - discount */
    finalPrice?: number
}