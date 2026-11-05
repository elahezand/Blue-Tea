/* Filter fields for each admin table. Param names are the contract the backend reads (see FILTERS.md). */
const date = (label) => ({ type: "date", name: "date", label, keys: ["from", "to"] })

export const productFilters = (categories = ["Coffee", "Herbal Teas", "Organic Snacks"]) => [
    { type: "search", name: "q", placeholder: "Search product name" },
    { type: "select", name: "category", label: "Category", options: categories },
    { type: "select", name: "available", label: "Stock", options: [{ value: "true", label: "In stock" }, { value: "false", label: "Out of stock" }] },
    { type: "range", name: "price", label: "Price", prefix: "$", keys: ["min", "max"] },
    { type: "select", name: "sort", label: "Sort", options: [{ value: "latest", label: "Newest" }, { value: "price-asc", label: "Price, low to high" }, { value: "price-desc", label: "Price, high to low" }, { value: "rating", label: "Top rated" }] },
]
export const menuFilters = (categories = []) => [
    { type: "search", name: "q", placeholder: "Search menu item" },
    { type: "select", name: "category", label: "Section", options: categories },
    { type: "range", name: "price", label: "Price", prefix: "$", keys: ["min", "max"] },
]
export const userFilters = [
    { type: "search", name: "q", placeholder: "Search name, email or phone" },
    { type: "select", name: "role", label: "Role", options: ["USER", "ADMIN"] },
    date("Joined"),
]
export const commentFilters = [
    { type: "search", name: "q", placeholder: "Search username, email or text" },
    { type: "select", name: "score", label: "Score", options: ["5", "4", "3", "2", "1"].map((n) => ({ value: n, label: `${n} stars` })) },
    { type: "select", name: "accepted", label: "Visibility", options: [{ value: "true", label: "Accepted" }, { value: "false", label: "Waiting" }] },
    { type: "select", name: "answered", label: "Answer", options: [{ value: "true", label: "Answered" }, { value: "false", label: "No answer" }] },
    date("Posted"),
]
export const contactFilters = [
    { type: "search", name: "q", placeholder: "Search name, email or company" },
    { type: "select", name: "answered", label: "Answer", options: [{ value: "true", label: "Answered" }, { value: "false", label: "No answer" }] },
    date("Received"),
]
export const reservationFilters = [
    { type: "search", name: "q", placeholder: "Search name, email or phone" },
    { type: "select", name: "status", label: "Status", options: ["Pending", "Confirmed", "Cancelled"] },
    { type: "select", name: "guests", label: "Party size", options: [{ value: "1-2", label: "1 to 2" }, { value: "3-4", label: "3 to 4" }, { value: "5+", label: "5 or more" }] },
    date("Table date"),
]
export const orderFilters = [
    { type: "search", name: "q", placeholder: "Search customer or order ID" },
    { type: "select", name: "status", label: "Status", options: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"] },
    { type: "select", name: "paid", label: "Payment", options: [{ value: "true", label: "Paid" }, { value: "false", label: "Unpaid" }] },
    { type: "range", name: "total", label: "Total", prefix: "$", keys: ["minTotal", "maxTotal"] },
    date("Ordered"),
]
export const articleFilters = [
    { type: "search", name: "q", placeholder: "Search title or author" },
    { type: "select", name: "status", label: "Status", options: ["Published", "Draft"] },
    date("Written"),
]
export const ticketFilters = [
    { type: "search", name: "q", placeholder: "Search subject or customer" },
    { type: "select", name: "status", label: "Status", options: ["Open", "Answered", "Closed"] },
    { type: "select", name: "topic", label: "Topic", options: ["Order", "Reservation", "Shop", "Website", "Other"] },
    date("Opened"),
]
