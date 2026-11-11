import { z } from "zod"
import { phoneSchema } from "./auth"

export const contactSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Name must be at least 3 characters")
        .max(40, "Name cannot exceed 40 characters")
        .refine((val) => /^[a-zA-Z؀-ۿ\s]+$/.test(val), "Name must only contain letters"),
    email: z.string().trim().email("Invalid email format"),
    phone: phoneSchema,
    company: z.string().trim().max(60, "Company name cannot exceed 60 characters").optional(),
    body: z.string().trim().min(10, "Message must be at least 10 characters").max(2000, "Message cannot exceed 2000 characters"),
})

export type ContactInput = z.infer<typeof contactSchema>
