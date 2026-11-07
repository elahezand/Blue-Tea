import type { CursorPaginated, ListParams, Paginated } from "@/types/api"

// Empty results with the right shape, so pages render before the services are written.
// Remove this file once every service returns real data.

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
    nextCursor: null,
    limit: toLimit(params),
})
