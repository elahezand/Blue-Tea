import { z } from "zod"
import { objectId } from "./common.schema.js"

export const toggleWishlistSchema = z.object({
    product: objectId("product"),
})

export type ToggleWishlistBody = z.infer<typeof toggleWishlistSchema>
