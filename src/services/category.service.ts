import serverFetch from "./serverFetch"
import { ENDPOINTS } from "@/utils/constant"
import type { Category, ProductCategoryNode } from "@/types/models"

export const getCategoryByName = async (name: string): Promise<Category | null> => {
    return null
}
export const getProductCategories = async (): Promise<ProductCategoryNode[]> => {
    const body = await serverFetch<ProductCategoryNode[] | { data: ProductCategoryNode[] }>({
        endpoint: ENDPOINTS.CATEGORY_TREE,
        cacheKey: "categories-tree",
        revalidateTime: 3600,
    })
    return Array.isArray(body) ? body : body?.data ?? []
}