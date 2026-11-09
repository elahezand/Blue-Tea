import { useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useDelete, useInfiniteQuery, usePost } from "@/hooks/useApi"
import { ENDPOINTS, WISHLIST_PER_PAGE } from "@/utils/constant"
import type { ID, Product } from "@/types/models"


const WISHLIST_KEY = ["wishlist"]

export const useGetMyWishlist = (enabled = true) =>
    useInfiniteQuery<Product>(ENDPOINTS.WISHLIST, { limit: WISHLIST_PER_PAGE }, {
        queryKey: WISHLIST_KEY,
        enabled,
        staleTime: 0,
    })

export const useAddToWishlist = () => {
    const queryClient = useQueryClient()

    return usePost<unknown, { product: ID }>(ENDPOINTS.WISHLIST, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: WISHLIST_KEY })
            toast.success("Saved to favorites")
        },
        errorFallback: "Couldn't save this to your favorites",
    })
}

export const useRemoveFromWishlist = () => {
    const queryClient = useQueryClient()

    return useDelete(ENDPOINTS.WISHLIST, {
        onSuccess: () => {
            toast.success("Removed from favorites")
            return queryClient.invalidateQueries({ queryKey: WISHLIST_KEY })
        },
        errorFallback: "Failed to remove from favorites",
    })
}