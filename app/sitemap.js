import connectToDB from "@/configs/db"
import ProductModel from "@/model/product"
import ArticleModel from "@/model/article"

export default async function sitemap() {
    const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const pages = ["", "/about", "/products", "/articles", "/contact-us"].map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly", priority: p === "" ? 1 : 0.7 }))
    try {
        await connectToDB()
        const [products, articles] = await Promise.all([ProductModel.find({}, "_id updatedAt").lean(), ArticleModel.find({}, "_id updatedAt").lean()])
        return [
            ...pages,
            ...products.map((p) => ({ url: `${base}/products/${p._id}`, lastModified: p.updatedAt, priority: 0.6 })),
            ...articles.map((a) => ({ url: `${base}/articles/${a._id}`, lastModified: a.updatedAt, priority: 0.5 })),
        ]
    } catch {
        return pages
    }
}
