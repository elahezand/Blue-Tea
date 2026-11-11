import { useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { usePost } from "@/hooks/useApi"
import { useSyncCart } from "@/services/cart.service"
import { getGuestCart } from "@/utils/guestCart"
import { AUTH_COOKIES, ENDPOINTS, ROLES, ROUTES } from "@/utils/constant"
import type { ApiResponse } from "@/types/api"
import type { SendCodeBody, VerifyCodeBody } from "@/types/auth"
import type { User } from "@/types/user"

const REDIRECT_DELAY = 800

export const useSendCode = (onSuccessCallback?: () => void) =>
    usePost<unknown, SendCodeBody>(ENDPOINTS.SEND_CODE, {
        onSuccess: (_, { phone }) => {
            toast.success(`We sent a code to ${phone}`)
            onSuccessCallback?.()
        },
        errorFallback: "Couldn't send the code",
    })

export const useResendCode = (onSuccessCallback?: () => void) =>
    usePost<unknown, SendCodeBody>(ENDPOINTS.SEND_CODE, {
        onSuccess: () => {
            toast.success("We sent a new code")
            onSuccessCallback?.()
        },
        errorFallback: "Couldn't send a new code",
    })

export const useVerifyCode = (next?: string | null) => {
    const { mutateAsync: syncCart } = useSyncCart()

    return usePost<ApiResponse<User>, VerifyCodeBody>(ENDPOINTS.VERIFY_CODE, {
        onSuccess: async ({ data: user }) => {
            toast.success("Welcome to Blue Tea")
            const guestItems = getGuestCart()
            if (guestItems.length) await syncCart({ items: guestItems }).catch(() => null)
            const target = next || (user?.role === ROLES.ADMIN ? ROUTES.ADMIN : ROUTES.HOME)
            setTimeout(() => window.location.replace(target), REDIRECT_DELAY)
        },
        errorFallback: "The code is not correct",
    })
}

export const useLogout = () => {
    const queryClient = useQueryClient()

    const leave = () => {
        document.cookie = `${AUTH_COOKIES.LOGGED_IN}=; Max-Age=0; path=/`
        queryClient.clear()
        setTimeout(() => window.location.replace(ROUTES.HOME), REDIRECT_DELAY)
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
