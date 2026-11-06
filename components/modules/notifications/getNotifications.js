import connectToDB from "@/configs/db"
import CommentModel from "@/model/comment"
import ReservationModel from "@/model/reservation"
import OrderModel from "@/model/order"
import ContactModel from "@/model/contact"
import "@/model/user"
import "@/model/product"

const safe = async (fn) => { try { return JSON.parse(JSON.stringify(await fn())) } catch { return [] } }
const clip = (t = "", n = 90) => (String(t).length > n ? `${String(t).slice(0, n).trim()}…` : String(t))
const recent = (items) => {
    const since = Date.now() - 30 * 864e5
    return items.filter((n) => n.time && new Date(n.time).getTime() > since).sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 12)
}

export async function adminNotifications() {
    await connectToDB()
    const [tickets, comments, reservations, orders, contacts] = await Promise.all([
        safe(() => TicketModel.find({ status: "Open" }).sort({ updatedAt: -1 }).limit(5).populate("user", "name").lean()),
        safe(() => CommentModel.find({ isAccept: false }).sort({ _id: -1 }).limit(5).populate("productID", "name").lean()),
        safe(() => ReservationModel.find({ status: "Pending" }).sort({ _id: -1 }).limit(5).lean()),
        safe(() => OrderModel.find({ status: "Pending" }).sort({ _id: -1 }).limit(5).populate("user", "name").lean()),
        safe(() => ContactModel.find({}).sort({ _id: -1 }).limit(3).lean()),
    ])
    return recent([
        ...tickets.map((t) => ({ id: `ticket-${t._id}-${t.messages?.length || 0}`, type: "ticket", title: `${t.user?.name || "A customer"} needs a reply`, text: clip(t.subject), href: `/p-admin/tickets/${t._id}`, time: t.updatedAt })),
        ...comments.map((c) => ({ id: `comment-${c._id}`, type: "comment", title: `New comment${c.productID?.name ? ` on ${c.productID.name}` : ""}`, text: clip(c.body), href: "/p-admin/comments", time: c.date || c.createdAt })),
        ...reservations.map((r) => ({ id: `res-${r._id}`, type: "reservation", title: `Table request from ${r.name}`, text: `${String(r.date || "").slice(0, 10)} at ${r.time || ""} · ${r.guests} guests`, href: "/p-admin/reservations?status=Pending", time: r.createdAt || r.date })),
        ...orders.map((o) => ({ id: `order-${o._id}`, type: "order", title: "New order", text: `${o.user?.name || "Customer"} · $${o.totalPrice}`, href: `/p-admin/orders?id=${o._id}`, time: o.createdAt })),
        ...contacts.map((c) => ({ id: `contact-${c._id}`, type: "message", title: `Message from ${c.name}`, text: clip(c.body), href: "/p-admin/contacts", time: c.createdAt })),
    ])
}

export async function userNotifications(userId) {
    if (!userId) return []
    await connectToDB()
    const [tickets, comments, orders] = await Promise.all([
        safe(() => TicketModel.find({ user: userId, status: "Answered" }).sort({ updatedAt: -1 }).limit(5).lean()),
        safe(() => CommentModel.find({ userID: userId, "answer.0": { $exists: true } }).sort({ _id: -1 }).limit(5).lean()),
        safe(() => OrderModel.find({ user: userId, status: { $ne: "Pending" } }).sort({ _id: -1 }).limit(3).lean()),
    ])
    return recent([
        ...tickets.map((t) => ({ id: `ticket-${t._id}-${t.messages?.length || 0}`, type: "ticket", title: "Blue Tea replied to your ticket", text: clip(t.subject), href: `/account/tickets/${t._id}`, time: t.updatedAt })),
        ...comments.map((c) => ({ id: `comment-${c._id}`, type: "comment", title: "Your comment got an answer", text: clip(c.answer?.[c.answer.length - 1]?.text || c.body), href: "/account/comments", time: c.answer?.[c.answer.length - 1]?.createdAt || c.date })),
        ...orders.map((o) => ({ id: `order-${o._id}-${o.status}`, type: "order", title: `Your order is ${String(o.status).toLowerCase()}`, text: `$${o.totalPrice}`, href: "/account/orders", time: o.updatedAt || o.createdAt })),
    ])
}
