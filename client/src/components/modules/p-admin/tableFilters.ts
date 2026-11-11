import type { FilterField, FilterOption } from "@/types/table"

const date = (label: string): FilterField => ({ type: "date", name: "date", label, keys: ["from", "to"] })

export const productFilters = (categories: FilterOption[] = []): FilterField[] => [
    { type: "search", name: "q", placeholder: "Search product name" },
    { type: "select", name: "category", label: "Category", options: categories },
    { type: "select", name: "available", label: "Stock", options: [{ value: "true", label: "In stock" }, { value: "false", label: "Out of stock" }] },
    { type: "range", name: "price", label: "Price", prefix: "$", keys: ["min", "max"] },
    { type: "select", name: "sort", label: "Sort", options: [{ value: "latest", label: "Newest" }, { value: "price-asc", label: "Price, low to high" }, { value: "price-desc", label: "Price, high to low" }, { value: "rating", label: "Top rated" }] },
    date("Added"),
]
export const menuFilters: FilterField[] = [
    { type: "search", name: "q", placeholder: "Search menu item" },
    { type: "range", name: "price", label: "Price", prefix: "$", keys: ["min", "max"] },
    date("Added"),
]
export const userFilters: FilterField[] = [
    { type: "search", name: "q", placeholder: "Search name, email or phone" },
    { type: "select", name: "role", label: "Role", options: ["USER", "ADMIN"] },
    { type: "select", name: "status", label: "Status", options: [{ value: "active", label: "Active" }, { value: "banned", label: "Banned" }] },
    date("Joined"),
]
export const commentFilters: FilterField[] = [
    { type: "search", name: "q", placeholder: "Search username, email or text" },
    { type: "select", name: "status", label: "Status", options: [{ value: "pending", label: "Waiting" }, { value: "accepted", label: "Accepted" }, { value: "rejected", label: "Rejected" }] },
    { type: "select", name: "score", label: "Score", options: ["5", "4", "3", "2", "1"].map((n) => ({ value: n, label: `${n} stars` })) },
    { type: "select", name: "answered", label: "Answer", options: [{ value: "true", label: "Answered" }, { value: "false", label: "No answer" }] },
    date("Posted"),
]
export const contactFilters: FilterField[] = [
    { type: "search", name: "q", placeholder: "Search name, email or company" },
    { type: "select", name: "answered", label: "Answer", options: [{ value: "true", label: "Answered" }, { value: "false", label: "No answer" }] },
    date("Received"),
]
export const reservationFilters: FilterField[] = [
    { type: "search", name: "q", placeholder: "Search name, email or phone" },
    { type: "select", name: "status", label: "Status", options: ["Pending", "Confirmed", "Cancelled"] },
    { type: "select", name: "guests", label: "Party size", options: [{ value: "1-2", label: "1 to 2" }, { value: "3-4", label: "3 to 4" }, { value: "5+", label: "5 or more" }] },
    date("Table date"),
]
export const orderFilters: FilterField[] = [
    { type: "search", name: "q", placeholder: "Search customer or order ID" },
    { type: "select", name: "status", label: "Status", options: [{ value: "pending", label: "Pending" }, { value: "paid", label: "Paid" }, { value: "processing", label: "Processing" }, { value: "shipped", label: "Shipped" }, { value: "delivered", label: "Delivered" }, { value: "canceled", label: "Canceled" }] },
    { type: "select", name: "type", label: "Payment", options: [{ value: "online", label: "Online" }, { value: "cash", label: "Cash" }] },
    { type: "range", name: "total", label: "Total", prefix: "$", keys: ["minTotal", "maxTotal"] },
    date("Ordered"),
]
export const articleFilters: FilterField[] = [
    { type: "search", name: "q", placeholder: "Search title or author" },
    { type: "select", name: "status", label: "Status", options: [{ value: "publish", label: "Published" }, { value: "unpublish", label: "Draft" }] },
    date("Written"),
]
export const ticketFilters: FilterField[] = [
    { type: "search", name: "q", placeholder: "Search subject or customer" },
    { type: "select", name: "status", label: "Status", options: ["Open", "Answered", "Closed"] },
    { type: "select", name: "type", label: "Topic", options: ["Order", "Reservation", "Shop", "Website", "Other"] },
    date("Opened"),
]
