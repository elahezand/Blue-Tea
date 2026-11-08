import type { CursorPaginated, ListParams, Paginated } from "@/types/api"


const toLimit = (params?: ListParams) => Number(params?.limit) || 10
const toPage = (params?: ListParams) => Number(params?.page) || 1

export const emptyPage = <T>(params?: ListParams): Paginated<T> => ({
    data: [],
    totalCount: 0,
    pageCount: 0,
    page: toPage(params),
    limit: toLimit(params),
})

export const emptyCursorPage = <T>(params?: ListParams): CursorPaginated<T> => ({
    data: [],
    pagination: { nextCursor: null, limit: toLimit(params), hasMore: false },
})