import { z } from "zod"
import { optionalImageSchema } from "./file"

export const menuItemSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(60, "Name cannot exceed 60 characters"),
    price: z.coerce.number({ message: "Enter a price" }).min(0.1, "Price must be greater than 0"),
    description: z.string().trim().min(5, "Description must be at least 5 characters").max(300, "Description cannot exceed 300 characters"),
    category: z.string().min(1, "Pick a section"),
    size: z.string().trim().max(30, "Size cannot exceed 30 characters").optional(),
    img: optionalImageSchema,
})

export type MenuItemInput = z.input<typeof menuItemSchema>
export type MenuItemOutput = z.output<typeof menuItemSchema>
