import type { HydratedDocument } from "mongoose"
import Contact, { type IContact } from "../models/Contact.js"
import type { IUser } from "../models/User.js"
import type { AdminListQuery } from "../schemas/common.schema.js"
import type { ContactBody, ReplyContactBody } from "../schemas/contact.schema.js"
import { AppError } from "../utils/AppError.js"
import { buildListQuery } from "../utils/buildListQuery.js"
import { sendMail } from "../utils/mail.js"
import { paginate } from "../utils/paginate.js"

type UserDoc = HydratedDocument<IUser>

/* ---------- Public ---------- */

export const create = async (body: ContactBody, user?: UserDoc) =>
    Contact.create({ ...body, user: user?._id ?? null })

/* ---------- Admin ---------- */
export const listAdmin = async ({ limit, cursor, q, preset, from, to, answered }: AdminListQuery) =>
    paginate(Contact, {
        limit,
        cursor,
        filters: buildListQuery<IContact>({ q, preset, from, to }, {
            search: ["name", "email", "phone", "company", "body"],
            extra: answered === undefined ? undefined : { answeredAt: answered ? { $ne: null } : null },
        }),
        sort: { createdAt: -1 },
    })

export const reply = async ({ contact: id, body }: ReplyContactBody) => {
    const contact = await Contact.findById(id)
    if (!contact) throw new AppError("Message not found", 404)

    await sendMail(
        contact.email,
        "Re: your message to Blue Tea",
        `Hi ${contact.name},\n\n${body}\n\n---\nYou wrote:\n${contact.body}\n\nBlue Tea`,
    )

    contact.answer.push(body)
    contact.answeredAt = new Date()
    await contact.save()
    return contact
}
export const remove = async (id: string) => {
    const contact = await Contact.findByIdAndDelete(id)
    if (!contact) throw new AppError("Message not found", 404)
}