import { emptyPage, emptyCursorPage } from "./empty"
import type { CursorPaginated, ListParams, Paginated } from "@/types/api"
import type { Article, ID } from "@/types/models"
// TODO: write these.

export const getLatestArticles = async (limit = 5): Promise<Article[]> => {
    return []
}

/** Journal list ("load more"), searched by title / short description with params.q */
export const getArticles = async (params: ListParams): Promise<CursorPaginated<Article>> => {
    return emptyCursorPage(params)
}

export const getArticleById = async (id: ID): Promise<Article | null> => {
    return null
}

/** Newest articles except the one with this id. */
export const getOtherArticles = async (id: ID, limit = 4): Promise<Article[]> => {
    return []
}

export const getAdminArticles = async (params: ListParams): Promise<Paginated<Article>> => {
    return emptyPage(params)
}

export const getArticlesForSitemap = async (): Promise<Pick<Article, "_id" | "updatedAt">[]> => {
    return []
}
