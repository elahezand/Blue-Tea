import { notifyAdmins } from "../utils/notify.js"
import { Schema, model, type Types } from "mongoose"

export interface IContact {
    name: string
    email: string
    user: Types.ObjectId | null
    phone: string
    company: string
    body: string
    answer: string[]
    answeredAt: Date | null
    createdAt: Date
    updatedAt: Date
}

const contactSchema = new Schema<IContact>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    company: { type: String, default: "" },
    body: { type: String, required: true, trim: true },
    user: { type: Schema.Types.ObjectId, ref: "User", default: null },
    answer: [String],
    answeredAt: { type: Date, default: null },
}, { timestamps: true })

contactSchema.index({ answeredAt: 1, createdAt: -1 })
contactSchema.index({ createdAt: -1 })
contactSchema.index({ user: 1, createdAt: -1 })

contactSchema.pre("save", function () {
    this.$locals.wasNew = this.isNew
})

contactSchema.post("save", async function (doc) {
    if (!doc.$locals.wasNew) return
    await notifyAdmins({ type: "message", title: "New message", text: `${doc.name}: ${doc.body.slice(0, 80)}`, href: "/p-admin/contacts", entityId: doc._id })
})

const Contact = model<IContact>("Contact", contactSchema)

export default Contact
