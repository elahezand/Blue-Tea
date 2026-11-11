import type { ID } from "./api"
import type { Category } from "./category"

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

export interface ProductQuery {
    category?: string
    q?: string
    min?: string
    max?: string
    sort?: string
    limit?: number
}
