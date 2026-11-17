import { z } from "zod"
import { emailSchema, nameSchema, optional, phoneSchema } from "./common.schema.js"

export const profileSchema = z.object({
    name: nameSchema,
    email: emailSchema,
})

export const createUserSchema = profileSchema.extend({
    phone: phoneSchema,
    role: z.enum(["USER", "ADMIN"]).default("USER"),
})

export const banUserSchema = z.object({
    reason: optional(z.string().trim().min(3, "Reason must be at least 3 characters").max(300)),
})

export type ProfileBody = z.infer<typeof profileSchema>
export type CreateUserBody = z.infer<typeof createUserSchema>
export type BanUserBody = z.infer<typeof banUserSchema>
