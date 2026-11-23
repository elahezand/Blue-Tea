import { isValidObjectId } from "mongoose"
import { z } from "zod"

const empty = (value: unknown) => (value === "" || value === null ? undefined : value)

export const objectId = (label = "id") => z.string().trim().refine(isValidObjectId, `Invalid ${label}`)

export const optional = <T extends z.ZodTypeAny>(schema: T) => z.preprocess(empty, schema.optional())

export const phoneSchema = z
    .string()
    .trim()
    .transform((value) => value.replace(/[\s().-]/g, ""))
    .pipe(z.string().regex(/^\+[1-9]\d{6,14}$/, "Enter your number with the country code, for example +14155550123"))

export const emailSchema = z.string().trim().toLowerCase().email("Invalid email format")

export const nameSchema = z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(40, "Name cannot exceed 40 characters")
    .regex(/^[a-zA-Z؀-ۿ\s]+$/, "Name must only contain letters")

export const priceSchema = z.coerce.number({ message: "Enter a price" }).min(0, "Price can not be negative")

export const boolSchema = z.preprocess((value) => (value === "true" ? true : value === "false" ? false : value), z.boolean())

export const listSchema = (item: z.ZodTypeAny = z.string().trim().min(1)) =>
    z.preprocess((value) => {
        if (value === undefined || value === "") return []
        if (Array.isArray(value)) return value
        if (typeof value === "string") {
            if (value.trim().startsWith("[")) {
                try {
                    return JSON.parse(value)
                } catch {
                    return value
                }
            }
            return value.split(",").map((part) => part.trim()).filter(Boolean)
        }
        return value
    }, z.array(item))

export const dateOnly = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use the YYYY-MM-DD format")

export const listQuery = z.object({
    limit: optional(z.coerce.number().int().min(1).max(100)),
    cursor: optional(z.string().max(500)),
    q: optional(z.string().trim().max(100)),
})

export const accountListQuery = listQuery.extend({
    status: optional(z.string().trim().max(30)),
    preset: optional(z.enum(["all", "today", "7d", "30d", "90d"])),
    from: optional(dateOnly),
    to: optional(dateOnly),
})
export const commentListQuery = listQuery.extend({
    answered: optional(boolSchema),
})

export const adminListQuery = listQuery.extend({
    status: optional(z.string().trim().max(30)),
    type: optional(z.string().trim().max(30)),
    role: optional(z.enum(["USER", "ADMIN"])),
    category: optional(objectId("category")),
    product: optional(objectId("product")),
    sort: optional(z.string().trim().max(30)),
    available: optional(boolSchema),
    answered: optional(boolSchema),
    score: optional(z.coerce.number().int().min(1).max(5)),
    guests: optional(z.enum(["1-2", "3-4", "5+"])),
    min: optional(z.coerce.number().min(0)),
    max: optional(z.coerce.number().min(0)),
    minTotal: optional(z.coerce.number().min(0)),
    maxTotal: optional(z.coerce.number().min(0)),
    preset: optional(z.enum(["all", "today", "7d", "30d", "90d"])),
    from: optional(dateOnly),
    to: optional(dateOnly),
})

export type ListQuery = z.infer<typeof listQuery>
export type CommentListQuery = z.infer<typeof commentListQuery>
export type AdminListQuery = z.infer<typeof adminListQuery>
export type UserListQuery = z.infer<typeof accountListQuery>


