import { z } from "zod"
import { optionalImageSchema } from "./file"

export const productSchema = z.object({
    name: z.string().trim().min(3, "Product name must be at least 3 characters").max(100, "Product name cannot exceed 100 characters"),
    price: z.coerce.number({ message: "Enter a price" }).min(1, "Price must be greater than 0"),
    shortDescription: z.string().trim().min(5, "Short description must be at least 5 characters"),
    longDescription: z.string().trim().min(20, "Long description must be at least 20 characters"),
    tags: z.string().optional(),
    variants: z.string().optional(),
    category: z.string().min(1, "Pick a category"),
    isAvailable: z.boolean().optional(),
    img: optionalImageSchema,
})

export type ProductInput = z.input<typeof productSchema>
export type ProductOutput = z.output<typeof productSchema>
