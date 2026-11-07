import { z } from "zod";
import { phoneSchema } from "./auth";

// Login is by phone number only, so a user has no password
export const userValidationSchema = z.object({
  // Use built-in length constraints to reduce Regex complexity
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(40, "Name cannot exceed 40 characters")
    // Simple regex for English & Persian letters to avoid backtracking issues
    .refine((val) => /^[a-zA-Z؀-ۿ\s]+$/.test(val), "Name must only contain letters"),

  // Use Zod's built-in email validator (Optimized & Secure against ReDoS)
  email: z
    .string()
    .email("Invalid email format"),

  // Iranian phone number (same rule as the login page)
  phone: phoneSchema,
});

export type UserInput = z.infer<typeof userValidationSchema>

// Account details form (user panel + admin profile)
export const accountDetailSchema = userValidationSchema.extend({
  avatar: z.any().nullable().optional(),
})

export type AccountDetailInput = z.infer<typeof accountDetailSchema>
