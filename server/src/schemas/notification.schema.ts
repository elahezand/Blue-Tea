import { z } from "zod"
import { objectId } from "./common.schema.js"

export const markReadSchema = z.object({
    ids: z.array(objectId("notification")).min(1, "Pick at least one notification").max(100),
})

export type MarkReadBody = z.infer<typeof markReadSchema>
