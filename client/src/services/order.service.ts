import { keepPreviousData, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { CART_KEY } from "./cart.service"
import { useGet, useInfiniteQuery, usePatch, usePost } from "@/hooks/useApi"
import { ACCOUNT_PER_PAGE, ADMIN_PER_PAGE, ENDPOINTS } from "@/utils/constant"
import type { ApiResponse, ID, ListParams } from "@/types/api"
import type { CancelItemBody, CreateOrderBody, CreateOrderResult, Order, OrderWithUser } from "@/types/order"

const ORDERS_KEY = ["orders"]
const ADMIN_ORDERS_KEY = ["admin", "orders"]
const DASHBOARD_KEY = ["dashboard"]
const ADMIN_DASHBOARD_KEY = ["admin", "dashboard"]

type OrderResponse = ApiResponse<Order>

export const useGetMyOrders = (params: ListParams = {}) =>
    useInfiniteQuery<Order>(ENDPOINTS.MY_ORDERS, { limit: ACCOUNT_PER_PAGE, ...params }, {
        queryKey: [...ORDERS_KEY, "me", params],
        placeholderData: keepPreviousData,
    })

export const useGetMyOrder = (id?: ID | null) =>
    useGet<OrderResponse, Order>(`${ENDPOINTS.MY_ORDERS}/${id}`, {}, {
        queryKey: [...ORDERS_KEY, "me", id],
        enabled: !!id,
        select: (res) => res.data,
    })

export const useCreateOrder = (onSuccessCallback?: (order: Order) => void) => {
    const queryClient = useQueryClient()

    return usePost<ApiResponse<CreateOrderResult>, CreateOrderBody>(ENDPOINTS.ORDERS, {
        onSuccess: ({ data }) => {
            if (data?.paymentUrl) {
                toast.success("Taking you to the payment page")
                window.location.href = data.paymentUrl
                return
            }
            toast.success("Your order is placed")
            queryClient.invalidateQueries({ queryKey: CART_KEY })
            queryClient.invalidateQueries({ queryKey: ORDERS_KEY })
            queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY })
            if (data?.order) onSuccessCallback?.(data.order)
        },
        errorFallback: "Couldn't place your order",
    })
}

export const useCancelMyOrder = () => {
    const queryClient = useQueryClient()

    return usePatch<OrderResponse>(ENDPOINTS.MY_ORDERS_CANCEL, {
        onSuccess: () => {
            toast.success("Your order is canceled")
            queryClient.invalidateQueries({ queryKey: ORDERS_KEY })
            queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY })
        },
        errorFallback: "This order can't be canceled anymore",
    })
}

export const useConfirmDelivery = () => {
    const queryClient = useQueryClient()

    return usePatch<OrderResponse>(ENDPOINTS.MY_ORDERS_DELIVERED, {
        onSuccess: () => {
            toast.success("Thanks for letting us know")
            queryClient.invalidateQueries({ queryKey: ORDERS_KEY })
            queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY })
        },
        errorFallback: "Couldn't confirm the delivery",
    })
}

export const useGetAdminOrders = (params: ListParams = {}) =>
    useInfiniteQuery<OrderWithUser>(ENDPOINTS.ADMIN_ORDERS, { limit: ADMIN_PER_PAGE, ...params }, {
        queryKey: [...ADMIN_ORDERS_KEY, params],
        placeholderData: keepPreviousData,
    })

export const useGetAdminOrder = (id?: ID | null) =>
    useGet<ApiResponse<OrderWithUser>, OrderWithUser>(`${ENDPOINTS.ADMIN_ORDERS}/${id}`, {}, {
        queryKey: [...ADMIN_ORDERS_KEY, id],
        enabled: !!id,
        select: (res) => res.data,
    })

export const useShipOrder = () => {
    const queryClient = useQueryClient()

    return usePatch<OrderResponse>(ENDPOINTS.ORDERS_SHIP, {
        onSuccess: () => {
            toast.success("Order marked as shipped")
            queryClient.invalidateQueries({ queryKey: ADMIN_ORDERS_KEY })
            queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_KEY })
        },
        errorFallback: "Couldn't update the order",
    })
}

export const useCancelOrder = () => {
    const queryClient = useQueryClient()

    return usePatch<OrderResponse>(ENDPOINTS.ORDERS_CANCEL, {
        onSuccess: () => {
            toast.success("Order canceled")
            queryClient.invalidateQueries({ queryKey: ADMIN_ORDERS_KEY })
            queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_KEY })
        },
        errorFallback: "Couldn't cancel the order",
    })
}

export const useCancelOrderItem = () => {
    const queryClient = useQueryClient()

    return usePatch<OrderResponse, CancelItemBody>(ENDPOINTS.ORDERS_CANCEL_ITEM, {
        onSuccess: () => {
            toast.success("Item canceled")
            queryClient.invalidateQueries({ queryKey: ADMIN_ORDERS_KEY })
            queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_KEY })
        },
        errorFallback: "Couldn't cancel the item",
    })
}
