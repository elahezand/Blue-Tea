import toast from "react-hot-toast"
import { usePost } from "@/hooks/useApi"
import { ENDPOINTS, ROLES, ROUTES } from "@/utils/constant"
import { useSyncCart } from "@/services/cart.service"
import { getGuestCart } from "@/utils/guestCart"
import type { User } from "@/types/models"
export interface SendCodeBody {
    phone: string
}

export interface VerifyCodeBody {
    phone: string
    code: string
}

// step 1 
export const useSendCode = (onSent?: () => void) =>
    usePost<unknown, SendCodeBody>(ENDPOINTS.SEND_CODE, {
        onSuccess: (_, { phone }) => {
            toast.success(`We sent a code to ${phone}`)
            onSent?.()
        },
        errorFallback: "Couldn't send the code. Please try again.",
    })

// step 2.
export const useVerifyCode = (next?: string | null) => {
    const { mutateAsync: syncCart } = useSyncCart()

    return usePost<{ user: User }, VerifyCodeBody>(ENDPOINTS.VERIFY_CODE, {
        onSuccess: async ({ user }) => {
            toast.success("Welcome to Blue Tea")
            const guestItems = getGuestCart()
            if (guestItems.length) {
                try {
                    await syncCart({ items: guestItems })
                } catch {
                    // already shown by useSyncCart; the login itself worked, so go on
                }
            }
            const target = next || (user?.role === ROLES.ADMIN ? ROUTES.ADMIN : ROUTES.HOME)
            setTimeout(() => window.location.replace(target), 800)
        },
        errorFallback: "The code is not correct",
    })
}