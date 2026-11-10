import { getProductsForSitemap } from "@/services/product.service"
import { getArticlesForSitemap } from "@/services/article.service"

export default async function sitemap() {
    const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const pages = ["", "/about", "/products", "/articles", "/contact-us"].map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly", priority: p === "" ? 1 : 0.7 }))
    try {
        const [products, articles] = await Promise.all([getProductsForSitemap(), getArticlesForSitemap()])
        return [
            ...pages,
            ...products.map((p) => ({ url: `${base}/products/${p._id}`, lastModified: p.updatedAt, priority: 0.6 })),
            ...articles.map((a) => ({ url: `${base}/articles/${a._id}`, lastModified: a.updatedAt, priority: 0.5 })),
        ]
    } catch {
        return pages
    }
}
