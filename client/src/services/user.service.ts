import { keepPreviousData, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useDelete, useGet, useInfiniteQuery, usePatch } from "@/hooks/useApi"
import { useAuth } from "@/hooks/useAuth"
import { ENDPOINTS } from "@/utils/constant"
import type { ApiResponse, ListParams } from "@/types/api"
import type { User } from "@/types/models"

export const PROFILE_KEY = ["user", "profile"]
const USERS_KEY = ["users"]

export const useProfile = (enabled = true) => {
    const { isLoggedIn } = useAuth()
    return useGet<ApiResponse<User>, User>(ENDPOINTS.PROFILE, {}, {
        queryKey: PROFILE_KEY,
        enabled: isLoggedIn && enabled,
        staleTime: 5 * 60 * 1000,
        select: (res) => res.data,
    })
}

export interface UpdateProfileBody {
    name: string
    email?: string
}

export const useUpdateProfile = () => {
    const queryClient = useQueryClient()

    return usePatch<ApiResponse<User>, UpdateProfileBody>(ENDPOINTS.PROFILE, {
        onSuccess: () => {
            toast.success("Your details were saved")
            return queryClient.invalidateQueries({ queryKey: PROFILE_KEY })
        },
        errorFallback: "Couldn't save your details",
    })
}

export const useGetUsers = (params: ListParams = {}) =>
    useInfiniteQuery<User>(ENDPOINTS.USERS, params, {
        queryKey: [...USERS_KEY, "list", params],
        placeholderData: keepPreviousData,
    })

export const useBannedUsers = (params: ListParams = {}) =>
    useInfiniteQuery<User>(ENDPOINTS.USERS_BANNED, params, {
        queryKey: [...USERS_KEY, "banned", params],
        placeholderData: keepPreviousData,
    })

export const useBanUser = () => {
    const queryClient = useQueryClient()

    return usePatch<ApiResponse<User>>(ENDPOINTS.USERS_BAN, {
        onSuccess: () => {
            toast.success("User banned")
            return queryClient.invalidateQueries({ queryKey: USERS_KEY })
        },
        errorFallback: "Couldn't ban this user",
    })
}

export const useUnbanUser = () => {
    const queryClient = useQueryClient()

    return usePatch<ApiResponse<User>>(ENDPOINTS.USERS_UNBAN, {
        onSuccess: () => {
            toast.success("User unbanned")
            return queryClient.invalidateQueries({ queryKey: USERS_KEY })
        },
        errorFallback: "Couldn't unban this user",
    })
}

export const useDeleteUser = () => {
    const queryClient = useQueryClient()

    return useDelete<unknown>(ENDPOINTS.USERS, {
        onSuccess: () => {
            toast.success("User deleted")
            return queryClient.invalidateQueries({ queryKey: USERS_KEY })
        },
        errorFallback: "Couldn't delete this user",
    })
}