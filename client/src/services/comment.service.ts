import { keepPreviousData, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { emptyPage } from "./empty"
import serverFetch from "./serverFetch"
import { useDelete, useInfiniteQuery, usePatch, usePost, usePut } from "@/hooks/useApi"
import { revalidateCommentsAction } from "@/actions/revalidate"
import { toQueryString } from "@/utils/helper"
import { COMMENTS_PER_PAGE, ENDPOINTS } from "@/utils/constant"
import type { ApiResponse, CursorPaginated, ListParams, Paginated } from "@/types/api"
import type { Comment, CommentWithProduct, ID } from "@/types/models"
import type { CommentInput } from "@/validators/comment"

const COMMENTS_KEY = ["comments"]
const ADMIN_COMMENTS_KEY = ["admin", "comments"]

type CommentResponse = ApiResponse<Comment>

const productComments = (productId: ID) => `${ENDPOINTS.PRODUCTS}/${productId}/comments`

const productIdOf = (comment?: Comment) =>
    typeof comment?.productID === "object" ? comment.productID?._id : comment?.productID

export interface ReplyCommentBody {
    parent: ID
    body: string
}

export interface UpdateCommentBody {
    body?: string
    score?: number
}

export const getLatestComments = async (limit = 10): Promise<Comment[]> => {
    try {
        const body = await serverFetch<ApiResponse<Comment[]>>({
            endpoint: `${ENDPOINTS.LATEST_COMMENTS}${toQueryString({ limit })}`,
            cacheKey: "comments-latest",
            revalidateTime: 600,
        })
        return body.data ?? []
    } catch {
        return []
    }
}

export const getProductComments = async (productId: ID): Promise<CursorPaginated<Comment>> =>
    serverFetch<CursorPaginated<Comment>>({
        endpoint: `${productComments(productId)}${toQueryString({ limit: COMMENTS_PER_PAGE })}`,
        cacheKey: `comments-${productId}`,
        revalidateTime: 60,
    })

export const useInfiniteProductComments = (productId: ID, initialPage?: CursorPaginated<Comment>) =>
    useInfiniteQuery<Comment>(productComments(productId), { limit: COMMENTS_PER_PAGE }, {
        queryKey: [...COMMENTS_KEY, productId],
        initialData: initialPage ? { pages: [initialPage], pageParams: [null] } : undefined,
    })

export const useSendComment = (productId: ID, onSent?: () => void) =>
    usePost<unknown, CommentInput>(productComments(productId), {
        onSuccess: () => {
            toast.success("Thanks! Your review will show after we read it.")
            onSent?.()
        },
        errorFallback: "Couldn't send your review",
    })

export const useGetMyComments = (params: ListParams = {}) =>
    useInfiniteQuery<CommentWithProduct>(ENDPOINTS.MY_COMMENTS, { ...params }, {
        queryKey: [...COMMENTS_KEY, "me", params],
    })

export const useGetAdminComments = (params: ListParams = {}) =>
    useInfiniteQuery<CommentWithProduct>(ENDPOINTS.ADMIN_COMMENTS, { ...params }, {
        queryKey: [...ADMIN_COMMENTS_KEY, params],
        placeholderData: keepPreviousData,
    })

export const useAcceptComment = () => {
    const queryClient = useQueryClient()

    return usePatch<CommentResponse>(ENDPOINTS.COMMENTS_ACCEPT, {
        onSuccess: ({ data }) => {
            toast.success("Comment accepted")
            queryClient.invalidateQueries({ queryKey: ADMIN_COMMENTS_KEY })
            queryClient.invalidateQueries({ queryKey: COMMENTS_KEY })
            void revalidateCommentsAction(productIdOf(data))
        },
        errorFallback: "Couldn't accept the comment",
    })
}

export const useRejectComment = () => {
    const queryClient = useQueryClient()

    return usePatch<CommentResponse>(ENDPOINTS.COMMENTS_REJECT, {
        onSuccess: ({ data }) => {
            toast.success("Comment rejected")
            queryClient.invalidateQueries({ queryKey: ADMIN_COMMENTS_KEY })
            queryClient.invalidateQueries({ queryKey: COMMENTS_KEY })
            void revalidateCommentsAction(productIdOf(data))
        },
        errorFallback: "Couldn't reject the comment",
    })
}

export const useReplyComment = (onSent?: () => void) => {
    const queryClient = useQueryClient()

    return usePost<CommentResponse, ReplyCommentBody>(ENDPOINTS.COMMENTS_REPLY, {
        onSuccess: ({ data }) => {
            toast.success("Reply sent")
            queryClient.invalidateQueries({ queryKey: ADMIN_COMMENTS_KEY })
            queryClient.invalidateQueries({ queryKey: COMMENTS_KEY })
            void revalidateCommentsAction(productIdOf(data))
            onSent?.()
        },
        errorFallback: "Couldn't send the reply",
    })
}

export const useUpdateComment = (onSaved?: () => void) => {
    const queryClient = useQueryClient()

    return usePut<CommentResponse, UpdateCommentBody>(ENDPOINTS.COMMENTS, {
        onSuccess: ({ data }) => {
            toast.success("Comment saved")
            queryClient.invalidateQueries({ queryKey: ADMIN_COMMENTS_KEY })
            queryClient.invalidateQueries({ queryKey: COMMENTS_KEY })
            void revalidateCommentsAction(productIdOf(data))
            onSaved?.()
        },
        errorFallback: "Couldn't save the comment",
    })
}

export const useRemoveComment = () => {
    const queryClient = useQueryClient()

    return useDelete<CommentResponse>(ENDPOINTS.COMMENTS, {
        onSuccess: (res) => {
            toast.success("Comment deleted")
            queryClient.invalidateQueries({ queryKey: ADMIN_COMMENTS_KEY })
            queryClient.invalidateQueries({ queryKey: COMMENTS_KEY })
            void revalidateCommentsAction(productIdOf(res?.data))
        },
        errorFallback: "Couldn't delete the comment",
    })
}

export const getAdminComments = async (params: ListParams): Promise<Paginated<CommentWithProduct>> => {
    return emptyPage(params)
}