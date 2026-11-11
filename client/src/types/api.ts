export type ID = string

export type FieldErrors = Record<string, string>

export interface ApiResponse<T> {
    success: boolean
    data: T
    message?: string
}

export interface CursorPagination {
    nextCursor: string | null
    limit: number
    hasMore: boolean
}

export interface CursorPaginated<T> extends ApiResponse<T[]> {
    pagination: CursorPagination
}

export type SearchParams = Record<string, string | string[] | undefined>

export interface ListParams {
    limit?: string | number
    cursor?: string
    q?: string
    status?: string
    type?: string
    category?: string
    from?: string
    to?: string
    [key: string]: unknown
}

export interface RouteProps<P extends Record<string, string> = Record<string, never>> {
    params: Promise<P>
    searchParams: Promise<SearchParams>
}
