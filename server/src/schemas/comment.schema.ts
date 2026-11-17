import { z } from "zod"
import { emailSchema, nameSchema, objectId } from "./common.schema.js"

const bodySchema = z.string().trim().min(5, "Your review must be at least 5 characters").max(1000, "Your review cannot exceed 1000 characters")
const scoreSchema = z.coerce.number().int().min(1, "Pick a rating").max(5, "Maximum score is 5")

export const commentSchema = z.object({
    username: nameSchema,
    email: emailSchema,
    score: scoreSchema,
    body: bodySchema,
})

export const updateCommentSchema = z
    .object({ body: bodySchema.optional(), score: scoreSchema.optional() })
    .refine((data) => data.body !== undefined || data.score !== undefined, "Change the text or the score")

export const rejectCommentSchema = z.object({
    reason: z.string().trim().min(3, "Write a reason, at least 3 characters").max(300),
})

export const replyCommentSchema = z.object({
    parent: objectId("comment"),
    body: z.string().trim().min(2, "Write at least a couple of words").max(2000, "Your reply cannot exceed 2000 characters"),
})

export type CommentBody = z.infer<typeof commentSchema>
export type UpdateCommentBody = z.infer<typeof updateCommentSchema>
export type RejectCommentBody = z.infer<typeof rejectCommentSchema>
export type ReplyCommentBody = z.infer<typeof replyCommentSchema>
