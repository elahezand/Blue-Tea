import { cache } from "react"
import { keepPreviousData, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { emptyPage } from "./empty"
import serverFetch from "./serverFetch"
import { revalidateArticlesAction } from "@/actions/revalidate"
import { useDelete, useInfiniteQuery, usePost, usePut } from "@/hooks/useApi"
import { isValidObjectId, toQueryString } from "@/utils/helper"
import { ApiError } from "@/utils/apiError"
import { ENDPOINTS, ARTICLES_PER_PAGE } from "@/utils/constant"
import type { ApiResponse, CursorPaginated, ListParams, Paginated } from "@/types/api"
import type { Article, ID } from "@/types/models"

const ARTICLES_KEY = [ENDPOINTS.ARTICLES]
const ADMIN_ARTICLES_KEY = ["admin", "articles"]

export const getArticles = async (): Promise<CursorPaginated<Article>> => {
    return serverFetch<CursorPaginated<Article>>({
        endpoint: `${ENDPOINTS.ARTICLES}${toQueryString({ limit: ARTICLES_PER_PAGE })}`,
        cacheKey: "articles-first-page",
        revalidateTime: 60,
    })
}

export const getArticleById = cache(async (id: ID): Promise<Article | null> => {
    if (!isValidObjectId(id)) return null
    try {
        const body = await serverFetch<ApiResponse<Article>>({
            endpoint: `${ENDPOINTS.ARTICLES}/${id}`,
            cacheKey: `article-${id}`,
            revalidateTime: 60,
        })
        return body.data
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) return null
        throw error
    }
})

export const getLatestArticles = async (limit = 5): Promise<Article[]> => {
    try {
        const body = await serverFetch<CursorPaginated<Article>>({
            endpoint: `${ENDPOINTS.ARTICLES}${toQueryString({ limit })}`,
            cacheKey: "articles-latest",
            revalidateTime: 60,
        })
        return body?.data ?? []
    } catch {
        return []
    }
}

export const getOtherArticles = async (id: ID, limit = 4): Promise<Article[]> => {
    try {
        const body = await serverFetch<CursorPaginated<Article>>({
            endpoint: `${ENDPOINTS.ARTICLES}${toQueryString({ limit: limit + 1 })}`,
            cacheKey: "articles-latest",
            revalidateTime: 60,
        })
        return (body?.data ?? []).filter((a) => a._id !== id).slice(0, limit)
    } catch {
        return []
    }
}

export const useGetAdminArticles = (params: ListParams = {}) =>
    useInfiniteQuery<Article>(ENDPOINTS.ADMIN_ARTICLES, params, {
        queryKey: [...ADMIN_ARTICLES_KEY, params],
        placeholderData: keepPreviousData,
    })

export const useDraftArticle = () => {
    const queryClient = useQueryClient()

    return usePost<ApiResponse<Article>, FormData>(ENDPOINTS.ARTICLES, {
        onSuccess: ({ data }) => {
            toast.success("Draft saved")
            queryClient.invalidateQueries({ queryKey: ADMIN_ARTICLES_KEY })
            queryClient.invalidateQueries({ queryKey: ARTICLES_KEY })
            void revalidateArticlesAction(data?._id)
        },
        errorFallback: "Couldn't save the draft",
    })
}

export const useUpdateArticle = () => {
    const queryClient = useQueryClient()

    return usePut<ApiResponse<Article>, FormData>(ENDPOINTS.ARTICLES, {
        onSuccess: (_, { id }) => {
            toast.success("Article saved")
            queryClient.invalidateQueries({ queryKey: ADMIN_ARTICLES_KEY })
            queryClient.invalidateQueries({ queryKey: ARTICLES_KEY })
            void revalidateArticlesAction(id ? String(id) : undefined)
        },
        errorFallback: "Couldn't save the article",
    })
}

export const useRemoveArticle = () => {
    const queryClient = useQueryClient()

    return useDelete<unknown>(ENDPOINTS.ARTICLES, {
        onSuccess: (_, id) => {
            toast.success("Article deleted")
            queryClient.invalidateQueries({ queryKey: ADMIN_ARTICLES_KEY })
            queryClient.invalidateQueries({ queryKey: ARTICLES_KEY })
            void revalidateArticlesAction(id ? String(id) : undefined)
        },
        errorFallback: "Couldn't delete the article",
    })
}

export const getAdminArticles = async (params: ListParams): Promise<Paginated<Article>> => {
    return emptyPage(params)
}

export const getArticlesForSitemap = async (): Promise<Pick<Article, "_id" | "updatedAt">[]> => {
    return []
}