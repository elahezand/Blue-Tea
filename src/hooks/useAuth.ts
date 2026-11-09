import { useSyncExternalStore } from "react"
import { AUTH_COOKIES } from "@/utils/constant"

const readFlag = (): boolean =>
    document.cookie.split("; ").some((c) => c === `${AUTH_COOKIES.LOGGED_IN}=1`)

const subscribe = (onChange: () => void) => {
    window.addEventListener("focus", onChange)
    document.addEventListener("visibilitychange", onChange)
    return () => {
        window.removeEventListener("focus", onChange)
        document.removeEventListener("visibilitychange", onChange)
    }
}

export const useAuth = () => {
    const isLoggedIn = useSyncExternalStore(subscribe, readFlag, () => false)
    return { isLoggedIn }
}