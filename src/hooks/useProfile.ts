import { useGet } from "@/hooks/useApi"
import type { User } from "@/types/models"

export const useProfile = (enabled = true) =>
    useGet<User>("/users/profile", {}, {
        queryKey: ["user", "profile"],
        enabled,
        staleTime: 5 * 60 * 1000,
    })
