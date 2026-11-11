import { z } from "zod"
import { optionalImageSchema } from "./file"

export const articleSchema = z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters").max(100, "Title cannot exceed 100 characters"),
    author: z.string().trim().min(3, "Author must be at least 3 characters").max(50, "Author cannot exceed 50 characters"),
    shortDescription: z.string().trim().min(5, "Short description must be at least 5 characters").max(160, "Short description cannot exceed 160 characters"),
    content: z.string().refine((html) => html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim().length >= 20, "Content must be at least 20 characters"),
    cover: optionalImageSchema,
})

export type ArticleInput = z.infer<typeof articleSchema>
