import { cache } from "react"
import serverFetch from "./serverFetch"
import { ENDPOINTS } from "@/utils/constant"
import type { Category, ProductCategoryNode } from "@/types/models"


export const getProductCategories = cache(async (): Promise<ProductCategoryNode[]> => {
    const body = await serverFetch<ProductCategoryNode[] | { data: ProductCategoryNode[] }>({
        endpoint: ENDPOINTS.CATEGORY_TREE,
        cacheKey: "categories-tree",
        revalidateTime: 3600,
    })
    return Array.isArray(body) ? body : body?.data ?? []
})

export const storeCategories = (tree: ProductCategoryNode[]): ProductCategoryNode[] =>
    tree.length === 1 ? tree[0].children ?? [] : tree

export const getStoreCategories = async (): Promise<ProductCategoryNode[]> =>
    storeCategories(await getProductCategories().catch(() => []))

export const getCategoryByName = async (name: string): Promise<ProductCategoryNode | null> => {
    const find = (nodes: ProductCategoryNode[]): ProductCategoryNode | null => {
        for (const node of nodes) {
            if (node.name === name) return node
            const child = find(node.children ?? [])
            if (child) return child
        }
        return null
    }
    return find(await getProductCategories().catch(() => []))
}

// ---------- used by the admin panel (not written yet) ----------
export const getProductCategoryTree = getProductCategories

export const getCategories = async (): Promise<Category[]> => {
    return []
}
