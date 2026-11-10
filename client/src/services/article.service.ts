import { cache } from "react"
import { emptyPage } from "./empty"
import serverFetch from "./serverFetch"
import { isValidObjectId, toQueryString } from "@/utils/helper"
import { ApiError } from "@/utils/apiError"
import { ENDPOINTS, ARTICLES_PER_PAGE } from "@/utils/constant"
import type { CursorPaginated, ListParams, Paginated } from "@/types/api"
import type { Article, ID } from "@/types/models"


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
        const body = await serverFetch<Article | { data: Article }>({
            endpoint: `${ENDPOINTS.ARTICLES}/${id}`,
            cacheKey: `article-${id}`,
            revalidateTime: 60,
        })
        return "data" in body && !Array.isArray(body.data) ? body.data : (body as Article)
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

export const getAdminArticles = async (params: ListParams): Promise<Paginated<Article>> => {
    return emptyPage(params)
}

export const getArticlesForSitemap = async (): Promise<Pick<Article, "_id" | "updatedAt">[]> => {
    return []
}