import { z } from "zod"
import { phoneSchema } from "./common.schema.js"

export const sendCodeSchema = z.object({
    phone: phoneSchema,
})

export const verifyCodeSchema = z.object({
    phone: phoneSchema,
    code: z.string().trim().regex(/^\d{4,6}$/, "Enter the code from the SMS"),
})

export type SendCodeBody = z.infer<typeof sendCodeSchema>
export type VerifyCodeBody = z.infer<typeof verifyCodeSchema>
