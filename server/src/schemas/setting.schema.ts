import { z } from "zod"

export const settingSchema = z.object({
    shippingCost: z.coerce.number().min(0, "Shipping cost can not be negative").max(1000),
    freeShippingThreshold: z.preprocess((value) => (value === "" ? null : value), z.coerce.number().min(0).max(100000).nullable()),
})

export type SettingBody = z.infer<typeof settingSchema>
