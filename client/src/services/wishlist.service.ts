import { useQueryClient } from "@tanstack/react-query"
import { usePathname, useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useGet, useInfiniteQuery, usePost } from "@/hooks/useApi"
import { useAuth } from "@/hooks/useAuth"
import { ENDPOINTS, ROUTES, WISHLIST_PER_PAGE } from "@/utils/constant"
import type { ApiResponse, ID } from "@/types/api"
import type { Product } from "@/types/product"

const WISHLIST_KEY = ["wishlist"]
const WISHLIST_IDS_KEY = [...WISHLIST_KEY, "ids"]

export const useGetMyWishlist = (enabled = true) =>
    useInfiniteQuery<Product>(ENDPOINTS.WISHLIST, { limit: WISHLIST_PER_PAGE }, {
        queryKey: [...WISHLIST_KEY, "list"],
        enabled,
        staleTime: 0,
    })

export const useToggleWishlist = () => {
    const queryClient = useQueryClient()

    return usePost<ApiResponse<{ saved: boolean }>, { product: ID }>(ENDPOINTS.WISHLIST_TOGGLE, {
        onSuccess: ({ data }, { product }) => {
            queryClient.setQueryData<ApiResponse<ID[]>>(WISHLIST_IDS_KEY, (previous) => {
                if (!previous) return previous
                const ids = previous.data.filter((id) => id !== product)
                return { ...previous, data: data.saved ? [...ids, product] : ids }
            })
            toast.success(data.saved ? "Saved to favorites" : "Removed from favorites")
            return queryClient.invalidateQueries({ queryKey: WISHLIST_KEY })
        },
        errorFallback: "Couldn't update your favorites",
    })
}

export const useSavedProductIds = () => {
    const { isLoggedIn } = useAuth()
    const { data } = useGet<ApiResponse<ID[]>, ID[]>(ENDPOINTS.WISHLIST_IDS, {}, {
        queryKey: WISHLIST_IDS_KEY,
        enabled: isLoggedIn,
        select: (response) => response.data,
    })
    return new Set(isLoggedIn ? data : undefined)
}

export const useToggleFavorite = () => {
    const { isLoggedIn } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const { mutate, isPending } = useToggleWishlist()

    const askToSignIn = () => {
        toast("Sign in to save your favorites")
        router.push(`${ROUTES.LOGIN}?next=${encodeURIComponent(pathname)}`)
    }

    const toggleFavorite = (product: ID) => {
        if (isLoggedIn) return mutate({ product })
        askToSignIn()
    }

    return { toggleFavorite, isPending }
}
