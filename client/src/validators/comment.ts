import { z } from "zod";

export const commentValidationSchema = z.object({
    username: z
        .string()
        .min(3, "Name must be at least 3 characters")
        .max(40, "Name cannot exceed 40 characters")
        .refine((val) => /^[a-zA-Z\u0600-\u06FF\s]+$/.test(val), "Name must only contain letters"),
    email: z
        .string()
        .email("Invalid email format"),
    score: z
        .number()
        .min(1, "Pick a rating")
        .max(5, "Maximum score is 5"),

    body: z
        .string()
        .trim()
        .min(5, "Your review must be at least 5 characters")
        .max(1000, "Your review cannot exceed 1000 characters"),

});

export type CommentInput = z.infer<typeof commentValidationSchema>
