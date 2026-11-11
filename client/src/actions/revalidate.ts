"use server"
import { updateTag } from "next/cache"

export async function revalidateAboutAction() {
    updateTag("page-about")
}

export async function revalidateArticlesAction(id?: string) {
    updateTag("articles-first-page")
    updateTag("articles-latest")
    updateTag("articles-sitemap")
    if (id) updateTag(`article-${id}`)
}

export async function revalidateCategoriesAction() {
    updateTag("categories-tree")
}

export async function revalidateCommentsAction(productId?: string) {
    updateTag("comments-latest")
    if (productId) updateTag(`comments-${productId}`)
}

export async function revalidateMenuAction() {
    updateTag("menu")
}

export async function revalidateProductsAction(id?: string) {
    updateTag("products-home")
    updateTag("products")
    updateTag("products-sitemap")
    if (id) updateTag(`product-${id}`)
}
