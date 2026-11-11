import { z } from "zod"
import { phoneSchema } from "./auth"

export const checkoutSchema = z.object({
    fullName: z.string().trim().min(2, "Full name is required"),
    phone: phoneSchema,
    address: z.string().trim().min(5, "Address is required"),
    city: z.string().trim().min(2, "City is required"),
    postalCode: z.string().trim().regex(/^[A-Za-z0-9][A-Za-z0-9 -]{1,9}$/, "Enter a valid postal code"),
    paymentMethod: z.enum(["online", "cash"]),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>
