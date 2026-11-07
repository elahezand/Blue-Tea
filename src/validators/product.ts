import { z } from "zod";

export const productSchema = z.object({
    name: z
        .string()
        .min(3, "Product name must be at least 3 characters")
        .max(100, "Product name cannot exceed 100 characters"),

    price: z
        .number()
        .min(1, "Price must be greater than 0")
        .refine((v) => Number.isFinite(v), "Invalid price value"),

    longDescription: z
        .string()
        .min(20, "Long description must be at least 20 characters"),

    shortDescription: z
        .string()
        .min(5, "Short description must be at least 5 characters"),

    tags: z
        .array(z.string().min(2))
        .max(20, "You can only define up to 20 tags"),
    variants: z
        .array(z.string().min(1))
        .max(3, "You can only define up to 20 tags"),

    category: z
        .string()
        .min(1, "Subcategory is not valid"),

});

export type ProductInput = z.infer<typeof productSchema>

// Edit product form: the values as the form holds them (tags / size are typed as text)
export const editProductSchema = z.object({
    name: z.string().min(3, "Product name must be at least 3 characters").max(100, "Product name cannot exceed 100 characters"),
    price: z.coerce.number().min(1, "Price must be greater than 0"),
    shortDescription: z.string().min(5, "Short description must be at least 5 characters"),
    longDescription: z.string().min(20, "Long description must be at least 20 characters"),
    tags: z.string().optional(),
    variants: z.string().optional(),
    size: z.string().optional(),
    category: z.string().min(1, "Subcategory is not valid"),
    isAvailable: z.boolean().optional(),
})

export type EditProductInput = z.input<typeof editProductSchema>
export type EditProductOutput = z.output<typeof editProductSchema>
