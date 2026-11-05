export default function robots() {
    const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    return {
        rules: [{ userAgent: "*", allow: "/", disallow: ["/account", "/p-admin", "/api", "/cart", "/favorites", "/forgotPass"] }],
        sitemap: `${base}/sitemap.xml`,
    }
}
