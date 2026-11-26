import { z } from "zod"
import { adminListQuery, boolSchema, listQuery, listSchema, objectId, optional, priceSchema } from "./common.schema.js"

export const PRODUCT_SORTS = ["latest", "price-asc", "price-desc", "rating", "popular"] as const

export const productQuery = listQuery.extend({
    category: optional(z.string().trim().toLowerCase().max(60)),
    tag: optional(z.string().trim().toLowerCase().min(1).max(30)),
    min: optional(z.coerce.number().min(0)),
    max: optional(z.coerce.number().min(0)),
    sort: optional(z.enum(PRODUCT_SORTS)),
})

const grams = z.preprocess(
    (value) => typeof value === "string" && /^\d+\s*g$/i.test(value.trim()) ? value.trim().slice(0, -1) : value,
    z.coerce.number().int().min(1, "Weight must be at least 1 g").max(10000),
)

const gramsList = listSchema(grams)
    .pipe(z.array(z.number()).min(1, "Add at least one weight").max(10))
    .refine((list) => new Set(list).size === list.length, "Weights must be different")

export const adminProductQuery = adminListQuery.pick({
    limit: true, cursor: true, q: true, category: true, available: true,
    min: true, max: true, preset: true,
}).extend({
    from: optional(z.string().date()),
    to: optional(z.string().date()),
    stock: optional(z.enum(["in-stock", "out-of-stock"])),
    sort: optional(z.enum(PRODUCT_SORTS)),
}).refine(({ min, max }) => min === undefined || max === undefined || min <= max, {
    path: ["max"], message: "Maximum price must be at least the minimum price",
}).refine(({ from, to }) => !from || !to || from <= to, {
    path: ["to"], message: "End date must be on or after the start date",
})

export const productSchema = z.object({
    name: z.string().trim().min(3, "Product name must be at least 3 characters").max(100, "Product name cannot exceed 100 characters"),
    slug: optional(z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes")),
    price: priceSchema.refine((value) => value > 0, "Price must be greater than 0"),
    shortDescription: z.string().trim().min(5, "Short description must be at least 5 characters").max(300),
    longDescription: z.string().trim().min(20, "Long description must be at least 20 characters").max(5000),
    tags: listSchema(z.string().trim().min(1).max(30)).pipe(z.array(z.string()).max(15, "Up to 15 tags")),
    variants: gramsList,
    category: objectId("category"),
    stock: optional(z.coerce.number().int().min(0, "Stock can not be negative")),
    isAvailable: optional(boolSchema),
    origin: optional(z.string().trim().max(60)),
    notes: listSchema(z.string().trim().min(1).max(30)).pipe(z.array(z.string()).max(8, "Up to 8 notes")),
    brewTemp: optional(z.coerce.number().min(0).max(100)),
    brewTime: optional(z.string().trim().max(30)),
    brewAmount: optional(z.string().trim().max(30)),
})

export const updateProductSchema = productSchema.partial()

export type ProductQuery = z.infer<typeof productQuery>
export type AdminProductQuery = z.infer<typeof adminProductQuery>
export type ProductBody = z.infer<typeof productSchema>
export type UpdateProductBody = z.infer<typeof updateProductSchema>
