import { z } from "zod";

export const contactValidationSchema = z.object({
    name: z
        .string()
        .min(3, "Name must be at least 3 characters")
        .max(40, "Name cannot exceed 40 characters")
        .refine((val) => /^[a-zA-Z\u0600-\u06FF\s]+$/.test(val), "Name must only contain letters"),

    email: z
        .string()
        .email("Invalid email format"),

    phone: z
        .string()
        .length(11, "Phone number must be exactly 11 digits")
        .regex(/^09\d{9}$/, "Invalid Iranian phone number format"),

    company: z
        .string()
        .trim()
        .max(60, "Company name cannot exceed 60 characters")
        .optional(),

    body: z
        .string()
        .trim()
        .min(10, "Message must be at least 10 characters")
        .max(2000, "Message cannot exceed 2000 characters"),

});

export type ContactInput = z.infer<typeof contactValidationSchema>