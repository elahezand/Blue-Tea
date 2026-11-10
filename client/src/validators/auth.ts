import { z } from "zod";

// Iranian mobile number: 11 digits starting with 09
export const phoneSchema = z
    .string()
    .trim()
    .regex(/^09\d{9}$/, "Enter an 11-digit mobile number starting with 09")

// Step 1 of login: the phone number
export const phoneLoginSchema = z.object({
    phone: phoneSchema,
})

export type PhoneLoginInput = z.infer<typeof phoneLoginSchema>

// Step 2 of login: the code sent by SMS
export const verifyCodeSchema = z.object({
    code: z.string().trim().regex(/^\d{4,6}$/, "Enter the code from the SMS"),
})

export type VerifyCodeInput = z.infer<typeof verifyCodeSchema>
