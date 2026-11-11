import { z } from "zod"
import { phoneSchema } from "./auth"
import { optionalImageSchema } from "./file"

const nameSchema = z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(40, "Name cannot exceed 40 characters")
    .refine((val) => /^[a-zA-Z؀-ۿ\s]+$/.test(val), "Name must only contain letters")

export const profileSchema = z.object({
    name: nameSchema,
    email: z.string().trim().email("Invalid email format"),
    avatar: optionalImageSchema,
})

export type ProfileInput = z.infer<typeof profileSchema>

export const createUserSchema = profileSchema.omit({ avatar: true }).extend({
    phone: phoneSchema,
    role: z.enum(["USER", "ADMIN"]),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
