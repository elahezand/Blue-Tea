import { z } from "zod"
import { boolSchema, objectId, optional, priceSchema } from "./common.schema.js"

export const menuItemSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(60, "Name cannot exceed 60 characters"),
    price: priceSchema.refine((value) => value > 0, "Price must be greater than 0"),
    description: z.string().trim().min(5, "Description must be at least 5 characters").max(300, "Description cannot exceed 300 characters"),
    category: objectId("section"),
    size: optional(z.string().trim().max(30, "Size cannot exceed 30 characters")),
    isAvailable: optional(boolSchema),
})

export const updateMenuItemSchema = menuItemSchema.partial()

export type MenuItemBody = z.infer<typeof menuItemSchema>
export type UpdateMenuItemBody = z.infer<typeof updateMenuItemSchema>
