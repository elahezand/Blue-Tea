import { z } from "zod"
import { optionalImageSchema } from "./file"

const weights = z.string().transform((value) => value.split(",").map((weight) => weight.trim()).filter(Boolean))
    .refine((values) => values.length >= 1 && values.length <= 10, "Add between 1 and 10 weights")
    .refine((values) => values.every((value) => /^\d+\s*g?$/i.test(value)), "Enter weights in grams, for example 100g, 250g")
    .transform((values) => values.map((value) => Number.parseInt(value, 10)))
    .refine((values) => values.every((value) => value >= 1 && value <= 10000), "Each weight must be between 1 and 10,000 g")
    .refine((values) => new Set(values).size === values.length, "Weights must be different")

export const productSchema = z.object({
    name: z.string().trim().min(3, "Product name must be at least 3 characters").max(100, "Product name cannot exceed 100 characters"),
    price: z.coerce.number({ message: "Enter a price" }).positive("Price must be greater than 0"),
    stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
    shortDescription: z.string().trim().min(5, "Short description must be at least 5 characters"),
    longDescription: z.string().trim().min(20, "Long description must be at least 20 characters"),
    tags: z.string().optional(),
    variants: weights,
    category: z.string().min(1, "Pick a category"),
    isAvailable: z.boolean().optional(),
    img: optionalImageSchema,
})

export type ProductInput = z.input<typeof productSchema>
export type ProductOutput = z.output<typeof productSchema>
