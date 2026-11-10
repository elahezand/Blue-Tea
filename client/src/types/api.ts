
export interface Paginated<T> {
    data: T[]
    totalCount: number
    pageCount: number
    page: number
    limit: number
}

export interface CursorPagination {
    nextCursor: string | null
    limit: number
    hasMore: boolean
}

export interface CursorPaginated<T> {
    data: T[]
    pagination: CursorPagination
}

export type SearchParams = Record<string, string | string[] | undefined>

export interface ListParams {
    page?: string | number
    limit?: string | number
    cursor?: string
    q?: string
    status?: string | null
    category?: string
    [key: string]: unknown
}

export interface RouteProps<P extends Record<string, string> = Record<string, never>> {
    params: Promise<P>
    searchParams: Promise<SearchParams>
}

export interface ArticleQuery {
    q?: string
    limit?: number
}

export type FieldErrors = Record<string, string>