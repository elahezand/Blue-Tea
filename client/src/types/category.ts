import type { ID } from "./api"

export type CategoryType = "shop" | "menu"

export interface Category {
    _id: ID
    name: string
    slug: string
    type?: CategoryType
    parentId?: ID | null
    img?: string
}

export interface ProductCategoryNode {
    _id: ID
    name: string
    children: ProductCategoryNode[]
}
