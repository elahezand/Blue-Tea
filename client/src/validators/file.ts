import { z } from "zod"

export const MAX_IMAGE_MB = 5
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]
export const IMAGE_ACCEPT = IMAGE_TYPES.join(",")

export const imageSchema = z
    .custom<File>((value) => typeof File !== "undefined" && value instanceof File, "Pick an image")
    .refine((file) => file.size <= MAX_IMAGE_MB * 1024 * 1024, `The image must be smaller than ${MAX_IMAGE_MB} MB`)
    .refine((file) => IMAGE_TYPES.includes(file.type), "Use a JPG, PNG or WebP image")

export const optionalImageSchema = imageSchema.nullable().optional()
