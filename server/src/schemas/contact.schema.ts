import { z } from "zod"
import { emailSchema, nameSchema, objectId, optional, phoneSchema } from "./common.schema.js"

export const contactSchema = z.object({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    company: optional(z.string().trim().max(60, "Company name cannot exceed 60 characters")),
    body: z.string().trim().min(10, "Message must be at least 10 characters").max(2000, "Message cannot exceed 2000 characters"),
})

export const replyContactSchema = z.object({
    contact: objectId("message"),
    body: z.string().trim().min(2, "Write at least a couple of words").max(2000, "Your reply cannot exceed 2000 characters"),
})

export type ContactBody = z.infer<typeof contactSchema>
export type ReplyContactBody = z.infer<typeof replyContactSchema>
