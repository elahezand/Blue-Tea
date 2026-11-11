import { z } from "zod"

export const phoneSchema = z
    .string()
    .trim()
    .transform((value) => value.replace(/[\s().-]/g, ""))
    .pipe(z.string().regex(/^\+[1-9]\d{6,14}$/, "Enter your number with the country code, for example +14155550123"))

export const phoneLoginSchema = z.object({
    phone: phoneSchema,
})

export type PhoneLoginInput = z.infer<typeof phoneLoginSchema>

export const verifyCodeSchema = z.object({
    code: z.string().trim().regex(/^\d{4,6}$/, "Enter the code from the SMS"),
})

export type VerifyCodeInput = z.infer<typeof verifyCodeSchema>
