import type { Category, ProductCategoryNode } from "@/types/models"
// TODO: write these.

export const getCategories = async (): Promise<Category[]> => {
    return []
}

export const getCategoryByName = async (name: string): Promise<Category | null> => {
    return null
}

/** Tree used by the product forms: [{ _id, name (slug), children }] */
export const getProductCategoryTree = async (): Promise<ProductCategoryNode[]> => {
    return []
}
