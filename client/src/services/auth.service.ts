import { useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { usePost } from "@/hooks/useApi"
import { AUTH_COOKIES, ENDPOINTS, ROLES, ROUTES } from "@/utils/constant"
import { useSyncCart } from "@/services/cart.service"
import { getGuestCart } from "@/utils/guestCart"
import type { ApiResponse } from "@/types/api"
import type { User } from "@/types/models"
export interface SendCodeBody {
    phone: string
}

export interface VerifyCodeBody {
    phone: string
    code: string
}

export const useSendCode = (onSent?: () => void) =>
    usePost<unknown, SendCodeBody>(ENDPOINTS.SEND_CODE, {
        onSuccess: (_, { phone }) => {
            toast.success(`We sent a code to ${phone}`)
            onSent?.()
        },
        errorFallback: "Couldn't send the code. Please try again.",
    })

export const useResendCode = (onSent?: () => void) =>
    usePost<unknown, SendCodeBody>(ENDPOINTS.SEND_CODE, {
        onSuccess: () => {
            toast.success("We sent a new code")
            onSent?.()
        },
        errorFallback: "Couldn't send a new code. Please try again.",
    })

export const useVerifyCode = (next?: string | null) => {
    const { mutateAsync: syncCart } = useSyncCart()

    return usePost<ApiResponse<User>, VerifyCodeBody>(ENDPOINTS.VERIFY_CODE, {
        onSuccess: async ({ data: user }) => {
            toast.success("Welcome to Blue Tea")
            const guestItems = getGuestCart()
            if (guestItems.length) {
                try {
                    await syncCart({ items: guestItems })
                } catch {

                }
            }
            const target = next || (user?.role === ROLES.ADMIN ? ROUTES.ADMIN : ROUTES.HOME)
            setTimeout(() => window.location.replace(target), 800)
        },
        errorFallback: "The code is not correct",
    })
}

const resetAuth = () => {
    document.cookie = `${AUTH_COOKIES.LOGGED_IN}=; Max-Age=0; path=/`
}

export const useLogout = () => {
    const queryClient = useQueryClient()
    const leave = () => {
        resetAuth()
        queryClient.clear()
        setTimeout(() => window.location.replace(ROUTES.HOME), 800)
    }

    return usePost<unknown, void>(ENDPOINTS.SIGN_OUT, {
        onSuccess: () => {
            toast.success("You are signed out")
            leave()
        },
        onError: leave,
        silent: true,
    })
}