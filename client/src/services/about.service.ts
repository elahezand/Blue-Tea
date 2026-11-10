import { cache } from "react"
import serverFetch from "./serverFetch"
import type { AboutContent } from "@/types/about"

export const getAboutContent = cache(async (): Promise<AboutContent> => {
    const body = await serverFetch<AboutContent | { data: AboutContent }>({
        endpoint: "/pages/about",
        cacheKey: "page-about",
        revalidateTime: 3600,
    })
    return "data" in body ? body.data : body
})