import { cache } from "react"
import { keepPreviousData, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import serverFetch from "./serverFetch"
import { revalidateArticlesAction } from "@/actions/revalidate"
import { useDelete, useGet, useInfiniteQuery, usePost, usePut } from "@/hooks/useApi"
import { ApiError } from "@/utils/apiError"
import { isValidObjectId, toQueryString } from "@/utils/helper"
import { ADMIN_PER_PAGE, ARTICLES_PER_PAGE, ENDPOINTS } from "@/utils/constant"
import type { ApiResponse, CursorPaginated, ID, ListParams } from "@/types/api"
import type { Article } from "@/types/article"

const ARTICLES_KEY = [ENDPOINTS.ARTICLES]
const ADMIN_ARTICLES_KEY = ["admin", "articles"]

type ArticleResponse = ApiResponse<Article>

export const getArticles = async (): Promise<CursorPaginated<Article>> =>
    serverFetch<CursorPaginated<Article>>({
        endpoint: `${ENDPOINTS.ARTICLES}${toQueryString({ limit: ARTICLES_PER_PAGE })}`,
        cacheKey: "articles-first-page",
        revalidateTime: 60,
    })

export const getArticleById = cache(async (id: ID): Promise<Article | null> => {
    if (!isValidObjectId(id)) return null
    try {
        const body = await serverFetch<ArticleResponse>({
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
        return body.data ?? []
    } catch {
        return []
    }
}

export const getOtherArticles = async (id: ID, limit = 4): Promise<Article[]> => {
    const articles = await getLatestArticles(limit + 1)
    return articles.filter((a) => a._id !== id).slice(0, limit)
}

export const getArticlesForSitemap = async (): Promise<Pick<Article, "_id" | "updatedAt">[]> => {
    const articles: Pick<Article, "_id" | "updatedAt">[] = []
    let cursor: string | null = null
    do {
        const body: CursorPaginated<Article> = await serverFetch<CursorPaginated<Article>>({
            endpoint: `${ENDPOINTS.ARTICLES}${toQueryString({ limit: 50, cursor })}`,
            cacheKey: "articles-sitemap",
            revalidateTime: 86400,
        })
        articles.push(...body.data.map(({ _id, updatedAt }) => ({ _id, updatedAt })))
        cursor = body.pagination.hasMore ? body.pagination.nextCursor : null
    } while (cursor)
    return articles
}

export const useInfiniteArticles = (q?: string, initialPage?: CursorPaginated<Article>) =>
    useInfiniteQuery<Article>(ENDPOINTS.ARTICLES, q ? { q, limit: ARTICLES_PER_PAGE } : { limit: ARTICLES_PER_PAGE }, {
        initialData: !q && initialPage ? { pages: [initialPage], pageParams: [null] } : undefined,
        placeholderData: keepPreviousData,
    })

export const useGetAdminArticles = (params: ListParams = {}) =>
    useInfiniteQuery<Article>(ENDPOINTS.ADMIN_ARTICLES, { limit: ADMIN_PER_PAGE, ...params }, {
        queryKey: [...ADMIN_ARTICLES_KEY, params],
        placeholderData: keepPreviousData,
    })

export const useGetAdminArticle = (id?: ID | null) =>
    useGet<ArticleResponse, Article>(`${ENDPOINTS.ADMIN_ARTICLES}/${id}`, {}, {
        queryKey: [...ADMIN_ARTICLES_KEY, id],
        enabled: !!id,
        select: (res) => res.data,
    })

export const useDraftArticle = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient()

    return usePost<ArticleResponse, FormData>(ENDPOINTS.ARTICLES, {
        onSuccess: ({ data }) => {
            toast.success(data?.status === "publish" ? "Article published" : "Draft saved")
            queryClient.invalidateQueries({ queryKey: ADMIN_ARTICLES_KEY })
            queryClient.invalidateQueries({ queryKey: ARTICLES_KEY })
            void revalidateArticlesAction(data?._id)
            onSuccessCallback?.()
        },
        errorFallback: "Couldn't save the article",
    })
}

export const useUpdateArticle = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient()

    return usePut<ArticleResponse, FormData>(ENDPOINTS.ARTICLES, {
        onSuccess: (_, { id }) => {
            toast.success("Article saved")
            queryClient.invalidateQueries({ queryKey: ADMIN_ARTICLES_KEY })
            queryClient.invalidateQueries({ queryKey: ARTICLES_KEY })
            void revalidateArticlesAction(id ? String(id) : undefined)
            onSuccessCallback?.()
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
