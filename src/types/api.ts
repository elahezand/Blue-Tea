// Shared response shapes used by services, hooks and pages.

/** Page-based list (admin tables + <Pagination />) */
export interface Paginated<T> {
    data: T[]
    totalCount: number
    pageCount: number
    page: number
    limit: number
}

/** Cursor-based list ("load more" lists on the site) */
export interface CursorPaginated<T> {
    data: T[]
    nextCursor: string | null
    limit: number
}

/** searchParams of a Next.js page, after `await searchParams` */
export type SearchParams = Record<string, string | string[] | undefined>

/** Query values a list endpoint understands (?page=2&limit=10&cursor=...) */
export interface ListParams {
    page?: string | number
    limit?: string | number
    cursor?: string
    q?: string
    status?: string | null
    category?: string
    [key: string]: unknown
}

/** Props Next.js gives a page.tsx (named RouteProps so it does not clash with Next's global PageProps) */
export interface RouteProps<P extends Record<string, string> = Record<string, never>> {
    params: Promise<P>
    searchParams: Promise<SearchParams>
}

/** Field errors from the backend: { email: "Invalid email" } */
export type FieldErrors = Record<string, string>
