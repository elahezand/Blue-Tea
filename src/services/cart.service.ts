import { useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useDelete, useGet, usePatch, usePost } from "@/hooks/useApi"
import { ENDPOINTS } from "@/utils/constant"
import type { Cart, ID } from "@/types/models"

const CART_KEY = ["cart"]

type CartResponse = Cart | { data: Cart }

export interface AddToCartBody {
    product: ID
    grams: number
    quantity?: number
}

export const useGetMyCart = (enabled = true) => {
    const query = useGet<CartResponse>(ENDPOINTS.CART, {}, {
        queryKey: CART_KEY,
        enabled,
        staleTime: 0,
    })
    const data = query.data && "data" in query.data ? query.data.data : query.data
    return { ...query, data }
}

export const useAddToCart = () => {
    const queryClient = useQueryClient()

    return usePost<CartResponse, AddToCartBody>(ENDPOINTS.CART_ITEMS, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CART_KEY })
            toast.success("Added to cart")
        },
        errorFallback: "Couldn't add this to the cart",
    })
}

export const useUpdateCartItem = () => {
    const queryClient = useQueryClient()

    return usePatch<CartResponse, { quantity: number }>(ENDPOINTS.CART_ITEMS, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
        errorFallback: "Couldn't update the quantity",
    })
}

export const useRemoveFromCart = () => {
    const queryClient = useQueryClient()

    return useDelete<CartResponse>(ENDPOINTS.CART_ITEMS, {
        onSuccess: () => {
            toast.success("Removed from cart")
            return queryClient.invalidateQueries({ queryKey: CART_KEY })
        },
        errorFallback: "Failed to remove the item",
    })
}