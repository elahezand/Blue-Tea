import { keepPreviousData, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import serverFetch from "./serverFetch"
import { revalidateCommentsAction } from "@/actions/revalidate"
import { useDelete, useInfiniteQuery, usePatch, usePost } from "@/hooks/useApi"
import { toQueryString } from "@/utils/helper"
import { ACCOUNT_PER_PAGE, ADMIN_PER_PAGE, COMMENTS_PER_PAGE, ENDPOINTS } from "@/utils/constant"
import type { ApiResponse, CursorPaginated, ID, ListParams } from "@/types/api"
import type { Comment, CommentWithProduct, ReplyCommentBody } from "@/types/comment"
import type { CommentInput } from "@/validators/comment"

const COMMENTS_KEY = ["comments"]
const ADMIN_COMMENTS_KEY = ["admin", "comments"]

type CommentResponse = ApiResponse<Comment>

const productComments = (productId: ID) => `${ENDPOINTS.PRODUCTS}/${productId}/comments`

const productIdOf = (comment?: Comment) =>
    typeof comment?.productId === "object" ? comment.productId?._id : comment?.productId

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

export const useSendComment = (productId: ID, onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient()

    return usePost<CommentResponse, CommentInput>(productComments(productId), {
        onSuccess: () => {
            toast.success("Thanks! Your review will show after we read it")
            queryClient.invalidateQueries({ queryKey: COMMENTS_KEY })
            onSuccessCallback?.()
        },
        errorFallback: "Couldn't send your review",
    })
}

export const useGetMyComments = (params: ListParams = {}) =>
    useInfiniteQuery<CommentWithProduct>(ENDPOINTS.MY_COMMENTS, { limit: ACCOUNT_PER_PAGE, ...params }, {
        queryKey: [...COMMENTS_KEY, "me", params],
        placeholderData: keepPreviousData,
    })

export const useGetAdminComments = (params: ListParams = {}) =>
    useInfiniteQuery<CommentWithProduct>(ENDPOINTS.ADMIN_COMMENTS, { limit: ADMIN_PER_PAGE, ...params }, {
        queryKey: [...ADMIN_COMMENTS_KEY, params],
        placeholderData: keepPreviousData,
    })

export const useAcceptComment = () => {
    const queryClient = useQueryClient()

    return usePatch<CommentResponse>(ENDPOINTS.COMMENTS_ACCEPT, {
        onSuccess: (res) => {
            toast.success("Comment accepted")
            queryClient.invalidateQueries({ queryKey: ADMIN_COMMENTS_KEY })
            queryClient.invalidateQueries({ queryKey: COMMENTS_KEY })
            void revalidateCommentsAction(productIdOf(res?.data))
        },
        errorFallback: "Couldn't accept the comment",
    })
}

export const useRejectComment = () => {
    const queryClient = useQueryClient()

    return usePatch<CommentResponse, { reason: string }>(ENDPOINTS.COMMENTS_REJECT, {
        onSuccess: (res) => {
            toast.success("Comment rejected")
            queryClient.invalidateQueries({ queryKey: ADMIN_COMMENTS_KEY })
            queryClient.invalidateQueries({ queryKey: COMMENTS_KEY })
            void revalidateCommentsAction(productIdOf(res?.data))
        },
        errorFallback: "Couldn't reject the comment",
    })
}

export const useReplyComment = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient()

    return usePost<CommentResponse, ReplyCommentBody>(ENDPOINTS.COMMENTS_REPLY, {
        onSuccess: (res) => {
            toast.success("Reply sent")
            queryClient.invalidateQueries({ queryKey: ADMIN_COMMENTS_KEY })
            queryClient.invalidateQueries({ queryKey: COMMENTS_KEY })
            void revalidateCommentsAction(productIdOf(res?.data))
            onSuccessCallback?.()
        },
        errorFallback: "Couldn't send the reply",
    })
}

export const useRemoveComment = () => {
    const queryClient = useQueryClient()

    return useDelete<unknown>(ENDPOINTS.ADMIN_COMMENTS, {
        onSuccess: () => {
            toast.success("Comment deleted")
            queryClient.invalidateQueries({ queryKey: ADMIN_COMMENTS_KEY })
            queryClient.invalidateQueries({ queryKey: COMMENTS_KEY })
            void revalidateCommentsAction()
        },
        errorFallback: "Couldn't delete the comment",
    })
}