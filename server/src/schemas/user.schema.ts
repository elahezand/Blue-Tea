import { z } from "zod"
import { adminListQuery, emailSchema, nameSchema, optional, phoneSchema } from "./common.schema.js"

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

export const adminUserListQuery = adminListQuery.pick({
    limit: true, cursor: true, q: true, role: true, from: true, to: true, preset: true,
}).extend({
    from: optional(z.string().date()),
    to: optional(z.string().date()),
    status: optional(z.enum(["active", "banned"])),
}).refine(({ from, to }) => !from || !to || from <= to, {
    path: ["to"], message: "End date must be on or after the start date",
})

export type ProfileBody = z.infer<typeof profileSchema>
export type CreateUserBody = z.infer<typeof createUserSchema>
export type BanUserBody = z.infer<typeof banUserSchema>
export type AdminUserListQuery = z.infer<typeof adminUserListQuery>
