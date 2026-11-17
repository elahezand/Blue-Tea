import { z } from "zod"
import { optional } from "./common.schema.js"

export const aboutSchema = z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters").max(100),
    intro: optional(z.string().trim().max(500)),
    story: z.object({
        heading: z.string().trim().min(3, "Heading must be at least 3 characters").max(100),
        paragraphs: z.array(z.string().trim().min(1)).min(1, "Add at least one paragraph").max(10),
        image: optional(z.string().trim().max(300)),
    }),
    values: z
        .array(z.object({ title: z.string().trim().min(2).max(60), text: z.string().trim().min(5).max(300) }))
        .max(8),
    seo: z
        .object({
            title: optional(z.string().trim().max(70)),
            description: optional(z.string().trim().max(160)),
            image: optional(z.string().trim().max(300)),
        })
        .optional(),
})

export type AboutBody = z.infer<typeof aboutSchema>
