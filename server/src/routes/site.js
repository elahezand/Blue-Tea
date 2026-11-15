import { Router } from "express"
import MenuItem from "../models/MenuItem.js"
import Category from "../models/Category.js"
import Reservation from "../models/Reservation.js"
import Contact from "../models/Contact.js"
import { asyncHandler, isEmail, isPhone, send, sendMessage, validate } from "../utils/http.js"
import about from "../data/about.js"

// Small public routes of the main site: menu, about page, booking a table, contact form
const router = Router()

// GET /menu -> [{ _id, name, items: [...] }] grouped by section
// The section is item.section, or (older data) the name of the item's category.
router.get("/menu", asyncHandler(async (req, res) => {
    const [items, categories] = await Promise.all([
        MenuItem.find().sort({ order: 1, _id: 1 }).lean(),
        Category.find({}, "name").lean(),
    ])
    const categoryName = (id) => categories.find((c) => String(c._id) === String(id))?.name
    const sections = []
    for (const item of items) {
        const name = item.section || categoryName(item.category) || "Menu"
        let section = sections.find((s) => s.name === name)
        if (!section) sections.push((section = { _id: name, name, items: [] }))
        section.items.push({ _id: item._id, name: item.name, description: item.description, price: item.price })
    }
    send(res, sections)
}))

// GET /pages/about (fixed content for now: src/data/about.js)
router.get("/pages/about", (req, res) => send(res, about))

// POST /reservations
router.post("/reservations", asyncHandler(async (req, res) => {
    validate(req.body, {
        name: (v) => (String(v || "").trim().length >= 2 ? undefined : "Enter your name"),
        email: (v) => (isEmail(v) ? undefined : "Invalid email format"),
        phone: (v) => (isPhone(v) ? undefined : "Enter your number with the country code, for example +14155550123"),
        date: (v) => (!v ? "Pick a day" : v < new Date().toISOString().slice(0, 10) ? "Pick a day from today on" : undefined),
        time: (v) => (!v ? "Pick a time" : v < "08:00" || v > "23:00" ? "We are open 08:00 - 23:00" : undefined),
        guests: (v) => (Number(v) >= 1 && Number(v) <= 5 ? undefined : "Tables seat up to 5"),
    })
    const { name, email, phone, date, time, guests, notes } = req.body
    const reservation = await Reservation.create({ name, email, phone, date, time, guests, notes })
    send(res, reservation, 201)
}))

// POST /contacts
router.post("/contacts", asyncHandler(async (req, res) => {
    validate(req.body, {
        name: (v) => (String(v || "").trim().length >= 3 ? undefined : "Name must be at least 3 characters"),
        email: (v) => (isEmail(v) ? undefined : "Invalid email format"),
        phone: (v) => (isPhone(v) ? undefined : "Enter your number with the country code, for example +14155550123"),
        body: (v) => (String(v || "").trim().length >= 10 ? undefined : "Message must be at least 10 characters"),
    })
    const { name, email, phone, company, body } = req.body
    await Contact.create({ name, email, phone, company, body })
    sendMessage(res, "Message sent", 201)
}))

export default router
