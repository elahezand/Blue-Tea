import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery as useTanstackInfiniteQuery,
    type InfiniteData,
    type QueryKey,
    type UseInfiniteQueryOptions,
    type UseMutationOptions,
    type UseQueryOptions,
} from "@tanstack/react-query";
import http from "@/services/http";
import type { ApiError } from "@/utils/apiError";
import type { CursorPaginated, ListParams } from "@/types/api";
import type { ID } from "@/types/models";

// React Query hooks on top of services/http.ts (cookies + refresh token + error toast).
// Errors reaching onError are ApiError: { message, status, errors }  (see utils/apiError.ts)
//
// Extra options on every hook:
//   silent / skipAuthRefresh  -> passed to the request (see services/http.ts)
//   invalidate: [key, ...]    -> (mutations) refetch these queries after success, e.g. ["/products"]

interface RequestOptions {
    silent?: boolean
    skipAuthRefresh?: boolean
}

// Separates the request options from the React Query options
const splitOptions = <T extends RequestOptions>({ silent, skipAuthRefresh, ...rest }: T) =>
    [{ silent, skipAuthRefresh }, rest] as const

const withId = (url: string, id?: ID | number | null): string =>
    id !== undefined && id !== null && id !== "" ? `${url}/${id}` : url

// ---------- GET ----------

type GetOptions<T> = RequestOptions & Omit<UseQueryOptions<T, ApiError>, "queryFn">

/**
 * const { data, isLoading } = useGet<Paginated<Product>>("/products", { page: 1 })
 */
export const useGet = <T = unknown>(endpoint: string, params: ListParams = {}, options: Partial<GetOptions<T>> = {}) => {
    const [requestConfig, queryOptions] = splitOptions(options)
    return useQuery<T, ApiError>({
        queryKey: [endpoint, params],
        queryFn: async ({ signal }) => {
            const { data } = await http.get<T>(endpoint, { params, signal, ...requestConfig })
            return data
        },
        ...queryOptions,
    })
}

// ---------- mutations ----------

type MutationOptions<TData, TVariables> = RequestOptions &
    Omit<UseMutationOptions<TData, ApiError, TVariables>, "mutationFn"> & {
        invalidate?: QueryKey[] | string[]
    }

// Shared by usePost / usePut / usePatch / useDelete
const useApiMutation = <TData, TVariables>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    { invalidate = [], onSuccess, ...options }: Omit<MutationOptions<TData, TVariables>, keyof RequestOptions>
) => {
    const queryClient = useQueryClient()
    return useMutation<TData, ApiError, TVariables>({
        mutationFn,
        ...options,
        onSuccess: async (...args) => {
            await Promise.all(
                invalidate.map((key) => queryClient.invalidateQueries({ queryKey: Array.isArray(key) ? key : [key] }))
            )
            return onSuccess?.(...args)
        },
    })
}

/** Variables for usePut / usePatch: mutate({ id, payload }) */
export interface UpdateVariables<TPayload = unknown> {
    id?: ID | number
    payload?: TPayload
}

/**
 * const { mutate } = usePost<Comment, CommentInput>("/comments", { invalidate: ["/comments"] })
 * mutate({ body: "..." })          // JSON or FormData
 */
export const usePost = <TData = unknown, TPayload = unknown>(url: string, options: MutationOptions<TData, TPayload> = {}) => {
    const [requestConfig, mutationOptions] = splitOptions(options)
    return useApiMutation<TData, TPayload>(async (payload) => {
        const { data } = await http.post<TData>(url, payload, requestConfig)
        return data
    }, mutationOptions)
}

/**
 * const { mutate } = usePut<Product, ProductInput>("/products")
 * mutate({ id, payload })          // PUT /products/:id
 */
export const usePut = <TData = unknown, TPayload = unknown>(url: string, options: MutationOptions<TData, UpdateVariables<TPayload>> = {}) => {
    const [requestConfig, mutationOptions] = splitOptions(options)
    return useApiMutation<TData, UpdateVariables<TPayload>>(async ({ id, payload } = {}) => {
        const { data } = await http.put<TData>(withId(url, id), payload ?? {}, requestConfig)
        return data
    }, mutationOptions)
}

/**
 * const { mutate } = usePatch<Order>("/orders")
 * mutate({ id, payload })          // PATCH /orders/:id
 */
export const usePatch = <TData = unknown, TPayload = unknown>(url: string, options: MutationOptions<TData, UpdateVariables<TPayload>> = {}) => {
    const [requestConfig, mutationOptions] = splitOptions(options)
    return useApiMutation<TData, UpdateVariables<TPayload>>(async ({ id, payload } = {}) => {
        const { data } = await http.patch<TData>(withId(url, id), payload ?? {}, requestConfig)
        return data
    }, mutationOptions)
}

/**
 * const { mutate } = useDelete("/products", { invalidate: ["/products"] })
 * mutate(id)                       // DELETE /products/:id
 */
export const useDelete = <TData = unknown>(url: string, options: MutationOptions<TData, ID | number> = {}) => {
    const [requestConfig, mutationOptions] = splitOptions(options)
    return useApiMutation<TData, ID | number>(async (id) => {
        const { data } = await http.delete<TData>(withId(url, id), requestConfig)
        return data
    }, mutationOptions)
}

// ---------- infinite ("load more") ----------

/** What useInfiniteQuery gives back in `data`: React Query's pages + every item in one array */
export type InfiniteList<T> = InfiniteData<CursorPaginated<T>, string | null> & { items: T[] }

type InfiniteOptions<T> = RequestOptions &
    Partial<Omit<
        UseInfiniteQueryOptions<CursorPaginated<T>, ApiError, InfiniteList<T>, QueryKey, string | null>,
        "queryFn" | "getNextPageParam" | "initialPageParam" | "select"
    >>

/**
 * "Load more" lists. Works with the backend's cursor shape: { data: [], nextCursor, limit }
 *
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<Article>("/articles", { q })
 * data?.items  -> every loaded item in one array
 *
 * To start from the page the server already rendered:
 *   useInfiniteQuery("/articles", { q }, { initialData: { pages: [firstPage], pageParams: [null] } })
 */
export const useInfiniteQuery = <T = unknown>(endpoint: string, params: ListParams = {}, options: InfiniteOptions<T> = {}) => {
    const [requestConfig, queryOptions] = splitOptions(options)
    return useTanstackInfiniteQuery<CursorPaginated<T>, ApiError, InfiniteList<T>, QueryKey, string | null>({
        queryKey: [endpoint, params, "infinite"],
        queryFn: async ({ pageParam, signal }) => {
            const { data } = await http.get<CursorPaginated<T>>(endpoint, {
                params: pageParam ? { ...params, cursor: pageParam } : params,
                signal,
                ...requestConfig,
            })
            return data
        },
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
        select: (result) => ({ ...result, items: result.pages.flatMap((page) => page?.data ?? []) }),
        ...queryOptions,
    })
}
