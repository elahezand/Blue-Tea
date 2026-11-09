import { useGet } from "@/hooks/useApi"
import { useAuth } from "@/hooks/useAuth"
import type { User } from "@/types/models"


export const useProfile = (enabled = true) => {
    const { isLoggedIn } = useAuth()
    return useGet<User>("/users/profile", {}, {
        queryKey: ["user", "profile"],
        enabled: isLoggedIn && enabled,
        staleTime: 5 * 60 * 1000,
    })
}