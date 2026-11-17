import { z } from "zod"
import { dateOnly, objectId, optional, phoneSchema } from "./common.schema.js"

export const shippingAddressSchema = z.object({
    fullName: z.string().trim().min(2, "Full name is required").max(60),
    phone: phoneSchema,
    address: z.string().trim().min(5, "Address is required").max(300),
    city: z.string().trim().min(2, "City is required").max(60),
    postalCode: optional(z.string().trim().regex(/^[A-Za-z0-9][A-Za-z0-9 -]{1,9}$/, "Enter a valid postal code")),
})

export const createOrderSchema = z.object({
    paymentMethod: z.enum(["online", "cash"], { message: "Pick a payment method" }),
    shippingAddress: shippingAddressSchema,
    idempotencyKey: optional(z.string().trim().min(8).max(100)),
})

export const cancelOrderSchema = z.object({
    reason: optional(z.string().trim().min(3, "Reason must be at least 3 characters").max(300)),
})

export const cancelItemSchema = z.object({
    item: objectId("item"),
    reason: optional(z.string().trim().min(3, "Reason must be at least 3 characters").max(300)),
})

export const shipOrderSchema = z.object({
    trackingCode: optional(z.string().trim().max(60)),
    expectedDeliveryAt: optional(dateOnly),
})

export const paymentCallbackQuery = z
    .object({
        orderId: objectId("order"),
        authority: optional(z.string().trim().max(200)),
        status: optional(z.string().trim().max(30)),
    })
    .passthrough()

export type CreateOrderBody = z.infer<typeof createOrderSchema>
export type CancelOrderBody = z.infer<typeof cancelOrderSchema>
export type CancelItemBody = z.infer<typeof cancelItemSchema>
export type ShipOrderBody = z.infer<typeof shipOrderSchema>
export type PaymentCallbackQuery = z.infer<typeof paymentCallbackQuery>
