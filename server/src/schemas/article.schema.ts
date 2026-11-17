import { z } from "zod"
import { listSchema, optional } from "./common.schema.js"

const textLength = (html: string) => html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim().length

export const articleSchema = z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters").max(100, "Title cannot exceed 100 characters"),
    author: optional(z.string().trim().min(3, "Author must be at least 3 characters").max(50, "Author cannot exceed 50 characters")),
    shortDescription: z.string().trim().min(5, "Short description must be at least 5 characters").max(160, "Short description cannot exceed 160 characters"),
    content: z.string().refine((html) => textLength(html) >= 20, "Content must be at least 20 characters"),
    features: listSchema(z.string().trim().min(1).max(80)).pipe(z.array(z.string()).max(10, "Up to 10 features")),
    status: optional(z.enum(["publish", "unpublish"])),
})

export const updateArticleSchema = articleSchema.partial()

export type ArticleBody = z.infer<typeof articleSchema>
export type UpdateArticleBody = z.infer<typeof updateArticleSchema>
