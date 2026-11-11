import { z } from "zod"

export const replySchema = z.object({
    body: z.string().trim().min(2, "Write at least a couple of words").max(2000, "Your reply cannot exceed 2000 characters"),
})

export type ReplyInput = z.infer<typeof replySchema>
