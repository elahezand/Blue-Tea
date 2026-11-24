import type { FilterField, FilterOption } from "@/types/table"
import { RESERVATION_STATUS_LABELS } from "@/types/reservation"

const date = (label: string): FilterField => ({ type: "date", name: "date", label, keys: ["from", "to"] })

export const productFilters = (categories: FilterOption[] = []): FilterField[] => [
    { type: "search", name: "q", placeholder: "Search product name" },
    { type: "select", name: "category", label: "Category", options: categories },
    { type: "select", name: "available", label: "Status", options: [{ value: "true", label: "Available" }, { value: "false", label: "Unavailable" }] },
    { type: "select", name: "stock", label: "Stock", options: [{ value: "in-stock", label: "In stock" }, { value: "out-of-stock", label: "Out of stock" }] },
    { type: "range", name: "price", label: "Price", prefix: "$", keys: ["min", "max"] },
    { type: "select", name: "sort", label: "Sort", options: [{ value: "latest", label: "Newest" }, { value: "price-asc", label: "Price, low to high" }, { value: "price-desc", label: "Price, high to low" }, { value: "rating", label: "Top rated" }] },
    date("Added"),
]
export const menuFilters = (categories: FilterOption[] = []): FilterField[] => [
    { type: "search", name: "q", placeholder: "Search menu item" },
    { type: "select", name: "category", label: "Section", options: categories },
    { type: "select", name: "available", label: "Status", options: [{ value: "true", label: "Available" }, { value: "false", label: "Unavailable" }] },
    { type: "range", name: "price", label: "Price", prefix: "$", keys: ["min", "max"] },
    { type: "select", name: "sort", label: "Sort", options: [{ value: "latest", label: "Newest" }, { value: "name", label: "Name" }, { value: "price-asc", label: "Price, low to high" }, { value: "price-desc", label: "Price, high to low" }] },
]
export const userFilters: FilterField[] = [
    { type: "search", name: "q", placeholder: "Search name, email or phone" },
    { type: "select", name: "role", label: "Role", options: [{ value: "USER", label: "User" }, { value: "ADMIN", label: "Admin" }] },
    { type: "select", name: "status", label: "Status", options: [{ value: "active", label: "Active" }, { value: "banned", label: "Banned" }] },
    date("Joined"),
]
export const commentFilters = (products: FilterOption[] = []): FilterField[] => [
    { type: "select", name: "product", label: "Product", options: products },
    { type: "select", name: "status", label: "Status", options: [{ value: "accepted", label: "Approved" }, { value: "pending", label: "Waiting" }, { value: "rejected", label: "Rejected" }] },
    { type: "select", name: "answered", label: "Answer", options: [{ value: "true", label: "Answered" }, { value: "false", label: "No answer" }] },
    date("Posted"),
]
export const contactFilters: FilterField[] = [
    { type: "search", name: "q", placeholder: "Search name, email or company" },
    { type: "select", name: "answered", label: "Answer", options: [{ value: "true", label: "Answered" }, { value: "false", label: "No answer" }] },
    { type: "search", name: "q", placeholder: "Search name, email, phone or message" },
    date("Received"),
]
export const reservationFilters: FilterField[] = [
    { type: "search", name: "q", placeholder: "Search name, email or phone" },
    { type: "select", name: "status", label: "Status", options: Object.entries(RESERVATION_STATUS_LABELS).map(([value, label]) => ({ value, label })) },
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
