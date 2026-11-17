import { z } from "zod"
import { objectId, optional } from "./common.schema.js"

export const categorySchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(50, "Name cannot exceed 50 characters"),
    slug: optional(z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes")),
    type: z.enum(["shop", "menu"]).default("shop"),
    parentId: z.preprocess((value) => (value === "" || value === "null" ? null : value), objectId("parent").nullable().optional()),
})

export const updateCategorySchema = categorySchema.partial()

export type CategoryBody = z.infer<typeof categorySchema>
export type UpdateCategoryBody = z.infer<typeof updateCategorySchema>
