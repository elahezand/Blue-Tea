import { z } from "zod"
import { objectId } from "./common.schema.js"

const cartLine = z.object({
    product: objectId("product"),
    grams: z.coerce.number().int().min(1, "Pick a weight"),
    quantity: z.coerce.number().int().min(1).max(50, "Up to 50 of one item").default(1),
})

export const addToCartSchema = cartLine.extend({
    quantity: z.coerce.number().int().min(-1).max(50).refine(value => value !== 0, "Quantity change cannot be zero").default(1),
})

export const discountSchema = z.object({
    code: z.string().trim().toUpperCase().min(3, "Enter a discount code").max(30),
})

export const syncCartSchema = z.object({
    items: z.array(cartLine).max(50, "Your cart is too big"),
})

export type AddToCartBody = z.infer<typeof addToCartSchema>
export type DiscountBody = z.infer<typeof discountSchema>
export type SyncCartBody = z.infer<typeof syncCartSchema>
