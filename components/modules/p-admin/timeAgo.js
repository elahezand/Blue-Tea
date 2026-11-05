/* "5 min ago", "3 h ago", "2 d ago", then a short date */
export default function timeAgo(value) {
    const t = new Date(value).getTime()
    if (!t) return "-"
    const m = Math.max(0, Math.round((Date.now() - t) / 60000))
    if (m < 1) return "just now"
    if (m < 60) return `${m} min ago`
    if (m < 1440) return `${Math.round(m / 60)} h ago`
    if (m < 20160) return `${Math.round(m / 1440)} d ago`
    return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}
