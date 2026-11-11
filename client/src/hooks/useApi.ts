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

interface RequestOptions {
    silent?: boolean
    skipAuthRefresh?: boolean
    errorFallback?: string
}

const splitOptions = <T extends RequestOptions>({ silent, skipAuthRefresh, errorFallback, ...rest }: T) =>
    [{ silent, skipAuthRefresh, errorFallback }, rest] as const

const withId = (url: string, id?: ID | number | null | void): string =>
    id !== undefined && id !== null && id !== "" ? `${url}/${id}` : url

type GetOptions<T, TData = T> = RequestOptions & Omit<UseQueryOptions<T, ApiError, TData>, "queryFn">

export const useGet = <T = unknown, TData = T>(endpoint: string, params: ListParams = {}, options: Partial<GetOptions<T, TData>> = {}) => {
    const [requestConfig, queryOptions] = splitOptions(options)
    return useQuery<T, ApiError, TData>({
        queryKey: [endpoint, params],
        queryFn: async ({ signal }) => {
            const { data } = await http.get<T>(endpoint, { params, signal, ...requestConfig })
            return data
        },
        ...queryOptions,
    })
}

type MutationOptions<TData, TVariables> = RequestOptions &
    Omit<UseMutationOptions<TData, ApiError, TVariables>, "mutationFn"> & {
        invalidateKey?: QueryKey[] | string[]
    }

const useApiMutation = <TData, TVariables>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    { invalidateKey = [], onSuccess, ...options }: Omit<MutationOptions<TData, TVariables>, keyof RequestOptions>
) => {
    const queryClient = useQueryClient()
    return useMutation<TData, ApiError, TVariables>({
        mutationFn,
        ...options,
        onSuccess: async (...args) => {
            await Promise.all(
                invalidateKey.map((key) => queryClient.invalidateQueries({ queryKey: Array.isArray(key) ? key : [key] }))
            )
            return onSuccess?.(...args)
        },
    })
}

export interface UpdateVariables<TPayload = unknown> {
    id?: ID | number
    payload?: TPayload
}

export const usePost = <TData = unknown, TPayload = unknown>(url: string, options: MutationOptions<TData, TPayload> = {}) => {
    const [requestConfig, mutationOptions] = splitOptions(options)
    return useApiMutation<TData, TPayload>(async (payload) => {
        const { data } = await http.post<TData>(url, payload, requestConfig)
        return data
    }, mutationOptions)
}

export const usePut = <TData = unknown, TPayload = unknown>(url: string, options: MutationOptions<TData, UpdateVariables<TPayload>> = {}) => {
    const [requestConfig, mutationOptions] = splitOptions(options)
    return useApiMutation<TData, UpdateVariables<TPayload>>(async ({ id, payload } = {}) => {
        const { data } = await http.put<TData>(withId(url, id), payload ?? {}, requestConfig)
        return data
    }, mutationOptions)
}

export const usePatch = <TData = unknown, TPayload = unknown>(url: string, options: MutationOptions<TData, UpdateVariables<TPayload>> = {}) => {
    const [requestConfig, mutationOptions] = splitOptions(options)
    return useApiMutation<TData, UpdateVariables<TPayload>>(async ({ id, payload } = {}) => {
        const { data } = await http.patch<TData>(withId(url, id), payload ?? {}, requestConfig)
        return data
    }, mutationOptions)
}

export const useDelete = <TData = unknown>(url: string, options: MutationOptions<TData, ID | number | void> = {}) => {
    const [requestConfig, mutationOptions] = splitOptions(options)
    return useApiMutation<TData, ID | number | void>(async (id) => {
        const { data } = await http.delete<TData>(withId(url, id), requestConfig)
        return data
    }, mutationOptions)
}

export type InfiniteList<T> = InfiniteData<CursorPaginated<T>, string | null> & { items: T[] }

type InfiniteOptions<T> = RequestOptions &
    Partial<Omit<
        UseInfiniteQueryOptions<CursorPaginated<T>, ApiError, InfiniteList<T>, QueryKey, string | null>,
        "queryFn" | "getNextPageParam" | "initialPageParam" | "select"
    >>

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
        getNextPageParam: (lastPage) =>
            lastPage?.pagination?.hasMore && lastPage.pagination.nextCursor ? lastPage.pagination.nextCursor : undefined,
        select: (result) => ({ ...result, items: result.pages.flatMap((page) => page?.data ?? []) }),
        ...queryOptions,
    })
}