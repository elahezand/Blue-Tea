import { keepPreviousData, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useDelete, useGet, useInfiniteQuery, usePatch, usePost } from "@/hooks/useApi"
import { useAuth } from "@/hooks/useAuth"
import { ADMIN_PER_PAGE, ENDPOINTS } from "@/utils/constant"
import type { ApiResponse, ListParams } from "@/types/api"
import type { CreateUserBody, User } from "@/types/user"

export const PROFILE_KEY = ["user", "profile"]
const USERS_KEY = ["users"]

type UserResponse = ApiResponse<User>

export const useProfile = (enabled = true) => {
    const { isLoggedIn } = useAuth()
    return useGet<UserResponse, User>(ENDPOINTS.PROFILE, {}, {
        queryKey: PROFILE_KEY,
        enabled: isLoggedIn && enabled,
        staleTime: 5 * 60 * 1000,
        select: (res) => res.data,
    })
}

export const useUpdateProfile = () => {
    const queryClient = useQueryClient()

    return usePatch<UserResponse, FormData>(ENDPOINTS.PROFILE, {
        onSuccess: () => {
            toast.success("Your details were saved")
            queryClient.invalidateQueries({ queryKey: PROFILE_KEY })
        },
        errorFallback: "Couldn't save your details",
    })
}

export const useGetUsers = (params: ListParams = {}) =>
    useInfiniteQuery<User>(ENDPOINTS.USERS, { limit: ADMIN_PER_PAGE, ...params }, {
        queryKey: [...USERS_KEY, "list", params],
        placeholderData: keepPreviousData,
    })

export const useBannedUsers = (params: ListParams = {}) =>
    useInfiniteQuery<User>(ENDPOINTS.USERS_BANNED, { limit: ADMIN_PER_PAGE, ...params }, {
        queryKey: [...USERS_KEY, "banned", params],
        placeholderData: keepPreviousData,
    })

export const useCreateUser = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient()

    return usePost<UserResponse, CreateUserBody>(ENDPOINTS.USERS, {
        onSuccess: () => {
            toast.success("User created")
            queryClient.invalidateQueries({ queryKey: USERS_KEY })
            onSuccessCallback?.()
        },
        errorFallback: "Couldn't create the user",
    })
}

export const useBanUser = () => {
    const queryClient = useQueryClient()

    return usePatch<UserResponse>(ENDPOINTS.USERS_BAN, {
        onSuccess: () => {
            toast.success("User banned")
            queryClient.invalidateQueries({ queryKey: USERS_KEY })
        },
        errorFallback: "Couldn't ban this user",
    })
}

export const useUnbanUser = () => {
    const queryClient = useQueryClient()

    return usePatch<UserResponse>(ENDPOINTS.USERS_UNBAN, {
        onSuccess: () => {
            toast.success("User unbanned")
            queryClient.invalidateQueries({ queryKey: USERS_KEY })
        },
        errorFallback: "Couldn't unban this user",
    })
}

export const useDeleteUser = () => {
    const queryClient = useQueryClient()

    return useDelete<unknown>(ENDPOINTS.USERS, {
        onSuccess: () => {
            toast.success("User deleted")
            queryClient.invalidateQueries({ queryKey: USERS_KEY })
        },
        errorFallback: "Couldn't delete this user",
    })
}
