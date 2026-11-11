import { useQueryClient } from "@tanstack/react-query"
import { usePathname, useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useInfiniteQuery, usePost } from "@/hooks/useApi"
import { useAuth } from "@/hooks/useAuth"
import { ENDPOINTS, ROUTES, WISHLIST_PER_PAGE } from "@/utils/constant"
import type { ApiResponse } from "@/types/api"
import type { ID, Product } from "@/types/models"

const WISHLIST_KEY = ["wishlist"]

export const useGetMyWishlist = (enabled = true) =>
    useInfiniteQuery<Product>(ENDPOINTS.WISHLIST, { limit: WISHLIST_PER_PAGE }, {
        queryKey: WISHLIST_KEY,
        enabled,
        staleTime: 0,
    })

export const useToggleWishlist = () => {
    const queryClient = useQueryClient()

    return usePost<ApiResponse<{ saved: boolean }>, { product: ID }>(ENDPOINTS.WISHLIST_TOGGLE, {
        onSuccess: ({ data }) => {
            toast.success(data?.saved ? "Saved to favorites" : "Removed from favorites")
            queryClient.invalidateQueries({ queryKey: WISHLIST_KEY })
        },
        errorFallback: "Couldn't update your favorites",
    })
}

export const useToggleFavorite = () => {
    const { isLoggedIn } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const { mutate, isPending } = useToggleWishlist()

    const toggleFavorite = (product: ID) => {
        if (isLoggedIn) return mutate({ product })
        toast("Sign in to save your favorites")
        router.push(`${ROUTES.LOGIN}?next=${encodeURIComponent(pathname)}`)
    }

    return { toggleFavorite, isPending }
}