// schemas/reservationSchema.ts
import { z } from "zod";

// Helper: Check if date is in future
const futureDate = z.string().refine((val) => {
  const d = new Date(val);
  const now = new Date();
  return d >= now;
}, "Date must be in the future");

// Helper: Check time between 08:00 - 23:00
const validTime = z.string().refine((val) => {
  const [h, m] = val.split(":").map(Number);
  if (h < 8 || h > 23) return false;
  return true;
}, "Time must be between 08:00 and 23:00");


export const reservationValidationSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(40, "Name cannot exceed 40 characters")
    // Simple regex for English & Persian letters to avoid backtracking issues
    .refine((val) => /^[a-zA-Z\u0600-\u06FF\s]+$/.test(val), "Name must only contain letters"),

  // Use Zod's built-in email validator (Optimized & Secure against ReDoS)
  email: z
    .string()
    .email("Invalid email format"),

  // Iranian phone number validation with fixed length
  phone: z
    .string()
    .length(11, "Phone number must be exactly 11 digits")
    .regex(/^09\d{9}$/, "Invalid Iranian phone number format"),
  date: futureDate,

  time: validTime,

  guests: z
    .number()
    .int()
    .min(1, "At least 1 guest is required")
    .max(20, "Maximum 20 guests allowed"),

  message: z
    .string()
    .max(300, "Message cannot exceed 300 characters")
    .optional()
});

