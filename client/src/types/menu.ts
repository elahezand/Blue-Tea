import type { ID } from "./api"
import type { Category } from "./category"

export interface MenuItem {
    _id: ID
    name: string
    price: number
    description: string
    category: ID | Category
    size?: string
    img?: string
    createdAt?: string
}

export interface MenuSection {
    _id: ID
    name: string
    items: Pick<MenuItem, "_id" | "name" | "description" | "price">[]
}
