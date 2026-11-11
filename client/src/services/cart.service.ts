import { keepPreviousData, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useDelete, useGet, useInfiniteQuery, usePost } from "@/hooks/useApi"
import { useAuth } from "@/hooks/useAuth"
import { ENDPOINTS } from "@/utils/constant"
import type { ApiResponse, ListParams } from "@/types/api"
import type { AdminCart, Cart, ID } from "@/types/models"
import { addToGuestCart, clearGuestCart, type GuestCartItem } from "@/utils/guestCart"

const CART_KEY = ["cart"]
const ADMIN_CARTS_KEY = ["admin", "carts"]

type CartResponse = ApiResponse<Cart>

export interface AddToCartBody {
    product: ID
    grams: number
    quantity?: number
}

export const useGetMyCart = (enabled = true) => {
    const { isLoggedIn } = useAuth()
    return useGet<CartResponse, Cart>(ENDPOINTS.CART, {}, {
        queryKey: CART_KEY,
        enabled: isLoggedIn && enabled,
        staleTime: 0,
        select: (res) => res.data,
    })
}

export const useAddToCart = ({ notify = true }: { notify?: boolean } = {}) => {
    const queryClient = useQueryClient()

    return usePost<CartResponse, AddToCartBody>(ENDPOINTS.CART_ITEMS, {
        onSuccess: () => {
            if (notify) toast.success("Added to cart")
            return queryClient.invalidateQueries({ queryKey: CART_KEY })
        },
        errorFallback: "Couldn't update the cart",
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

export const useClearCart = () => {
    const queryClient = useQueryClient()

    return useDelete<CartResponse>(ENDPOINTS.CART_ITEMS, {
        onSuccess: () => {
            toast.success("Your cart is empty now")
            return queryClient.invalidateQueries({ queryKey: CART_KEY })
        },
        errorFallback: "Couldn't empty the cart",
    })
}

export const useRemoveCart = () => {
    const queryClient = useQueryClient()

    return useDelete<CartResponse>(ENDPOINTS.CART, {
        onSuccess: () => {
            toast.success("Cart removed")
            return queryClient.invalidateQueries({ queryKey: CART_KEY })
        },
        errorFallback: "Couldn't remove the cart",
    })
}

export const useApplyDiscount = (onApplied?: () => void) => {
    const queryClient = useQueryClient()

    return usePost<CartResponse, { code: string }>(ENDPOINTS.CART_DISCOUNT, {
        onSuccess: () => {
            toast.success("Discount code applied")
            onApplied?.()
            return queryClient.invalidateQueries({ queryKey: CART_KEY })
        },
        errorFallback: "This code is not valid",
    })
}

export const useSyncCart = ({ onSuccessCallback }: { onSuccessCallback?: () => void } = {}) => {
    const queryClient = useQueryClient()

    return usePost<unknown, { items: GuestCartItem[] }>(ENDPOINTS.CART_SYNC, {
        onSuccess: () => {
            toast.success("Your cart items were saved")
            clearGuestCart()
            queryClient.invalidateQueries({ queryKey: CART_KEY })
            onSuccessCallback?.()
        },
        errorFallback: "Couldn't save your cart items",
    })
}

export const useAddItem = () => {
    const { isLoggedIn } = useAuth()
    const { mutate, isPending } = useAddToCart()

    const addItem = (item: AddToCartBody) => {
        if (isLoggedIn) return mutate({ quantity: 1, ...item })
        addToGuestCart(item)
        toast.success("Added to cart")
    }

    return { addItem, isPending }
}

export const useGetAdminCarts = (params: ListParams = {}) =>
    useInfiniteQuery<AdminCart>(ENDPOINTS.ADMIN_CARTS, params, {
        queryKey: [...ADMIN_CARTS_KEY, params],
        placeholderData: keepPreviousData,
    })