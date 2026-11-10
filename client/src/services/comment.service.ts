import toast from "react-hot-toast"
import { emptyPage } from "./empty"
import serverFetch from "./serverFetch"
import { useInfiniteQuery, usePost } from "@/hooks/useApi"
import { toQueryString, unwrap } from "@/utils/helper"
import { COMMENTS_PER_PAGE, ENDPOINTS } from "@/utils/constant"
import type { CursorPaginated, ListParams, Paginated } from "@/types/api"
import type { Comment, CommentWithProduct, ID } from "@/types/models"
import type { CommentInput } from "@/validators/comment"


const productComments = (productId: ID) => `${ENDPOINTS.PRODUCTS}/${productId}/comments`

// ---------- server (public, cached) ----------
export const getLatestComments = async (limit = 10): Promise<Comment[]> => {
    try {
        const body = await serverFetch<Comment[] | { data: Comment[] }>({
            endpoint: `${ENDPOINTS.LATEST_COMMENTS}${toQueryString({ limit })}`,
            cacheKey: "comments-latest",
            revalidateTime: 600,
        })
        return unwrap(body) ?? []
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

// ---------- browser ----------
export const useInfiniteProductComments = (productId: ID, initialPage?: CursorPaginated<Comment>) =>
    useInfiniteQuery<Comment>(productComments(productId), { limit: COMMENTS_PER_PAGE }, {
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

export const getAdminComments = async (params: ListParams): Promise<Paginated<CommentWithProduct>> => {
    return emptyPage(params)
}
