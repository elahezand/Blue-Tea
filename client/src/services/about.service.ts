import { cache } from "react"
import { useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import serverFetch from "./serverFetch"
import { revalidateAboutAction } from "@/actions/revalidate"
import { useGet, usePut } from "@/hooks/useApi"
import { ENDPOINTS } from "@/utils/constant"
import type { AboutContent } from "@/types/about"
import type { ApiResponse } from "@/types/api"

const ABOUT_KEY = ["page", "about"]

export const getAboutContent = cache(async (): Promise<AboutContent> => {
    const body = await serverFetch<ApiResponse<AboutContent>>({
        endpoint: ENDPOINTS.ABOUT,
        cacheKey: "page-about",
        revalidateTime: 3600,
    })
    return body.data
})

export const useGetAbout = () =>
    useGet<ApiResponse<AboutContent>, AboutContent>(ENDPOINTS.ABOUT, {}, {
        queryKey: ABOUT_KEY,
        staleTime: 0,
        select: (res) => res.data,
    })

export const useUpdateAbout = () => {
    const queryClient = useQueryClient()

    return usePut<ApiResponse<AboutContent>, AboutContent>(ENDPOINTS.ABOUT, {
        onSuccess: () => {
            toast.success("About page saved")
            queryClient.invalidateQueries({ queryKey: ABOUT_KEY })
            void revalidateAboutAction()
        },
        errorFallback: "Couldn't save the About page",
    })
}
