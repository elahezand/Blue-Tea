import {
    useQuery,
    useMutation,
    useInfiniteQuery as useTanstackInfiniteQuery,
    type InfiniteData,
    type QueryKey,
    type UseInfiniteQueryOptions,
    type UseMutationOptions,
    type UseQueryOptions,
} from "@tanstack/react-query";
import http from "@/services/http";
import type { ApiError } from "@/utils/apiError";
import type { CursorPaginated, ID, ListParams } from "@/types/api";

interface RequestOptions {
    silent?: boolean;
    skipAuthRefresh?: boolean;
    errorFallback?: string;
}

const splitOptions = <T extends RequestOptions>(options: T) => {
    const { silent, skipAuthRefresh, errorFallback, ...rest } = options;
    const requestConfig = { silent, skipAuthRefresh, errorFallback };
    return [requestConfig, rest] as const;
};

const withId = (url: string, id?: ID | number | null | void): string => {
    if (id === undefined || id === null || id === "") return url;
    return `${url}/${id}`;
};

/* ---------- GET ---------- */

type GetOptions<T, D = T> = RequestOptions & Omit<UseQueryOptions<T, ApiError, D>, "queryFn">;

export const useGet = <T = unknown, D = T>(
    endpoint: string,
    params: ListParams = {},
    options: Partial<GetOptions<T, D>> = {}
) => {
    const [requestConfig, queryOptions] = splitOptions(options);

    return useQuery<T, ApiError, D>({
        queryKey: [endpoint, params],
        queryFn: async ({ signal }) => {
            const { data } = await http.get<T>(endpoint, {
                params,
                signal,
                ...requestConfig,
            });
            return data;
        },
        ...queryOptions,
    });
};

/* ---------- MUTATION OPTIONS ---------- */

type MutationOptions<T, D> = RequestOptions & Omit<UseMutationOptions<T, ApiError, D>, "mutationFn">;

/* ---------- POST ---------- */

export const usePost = <T = unknown, D = unknown>(
    url: string,
    options: MutationOptions<T, D> = {}
) => {
    const [requestConfig, mutationOptions] = splitOptions(options);

    return useMutation<T, ApiError, D>({
        mutationFn: async (payload: D) => {
            const { data } = await http.post<T>(url, payload, requestConfig);
            return data;
        },
        ...mutationOptions,
    });
};

/* ---------- PUT / PATCH ---------- */

export interface UpdateVariables<D = unknown> {
    id?: ID | number;
    payload?: D;
}

export const usePut = <T = unknown, D = unknown>(
    url: string,
    options: MutationOptions<T, UpdateVariables<D>> = {}
) => {
    const [requestConfig, mutationOptions] = splitOptions(options);

    return useMutation<T, ApiError, UpdateVariables<D>>({
        mutationFn: async ({ id, payload }: UpdateVariables<D> = {}) => {
            const { data } = await http.put<T>(withId(url, id), payload ?? {}, requestConfig);
            return data;
        },
        ...mutationOptions,
    });
};

export const usePatch = <T = unknown, D = unknown>(
    url: string,
    options: MutationOptions<T, UpdateVariables<D>> = {}
) => {
    const [requestConfig, mutationOptions] = splitOptions(options);

    return useMutation<T, ApiError, UpdateVariables<D>>({
        mutationFn: async ({ id, payload }: UpdateVariables<D> = {}) => {
            const { data } = await http.patch<T>(withId(url, id), payload ?? {}, requestConfig);
            return data;
        },
        ...mutationOptions,
    });
};

/* ---------- DELETE ---------- */

export const useDelete = <T = unknown>(
    url: string,
    options: MutationOptions<T, ID | number | void> = {}
) => {
    const [requestConfig, mutationOptions] = splitOptions(options);
    return useMutation<T, ApiError, ID | number | void>({
        mutationFn: async (id: ID | number | void) => {
            const { data } = await http.delete<T>(withId(url, id), requestConfig);
            return data;
        },
        ...mutationOptions,
    });
};

/* ---------- INFINITE ---------- */

export type InfiniteList<T> = InfiniteData<CursorPaginated<T>, string | null> & {
    items: T[];
};

type InfiniteOptions<T> = RequestOptions &
    Partial<
        Omit<
            UseInfiniteQueryOptions<CursorPaginated<T>, ApiError, InfiniteList<T>, QueryKey, string | null>,
            "queryFn" | "getNextPageParam" | "initialPageParam" | "select"
        >
    >;

export const useInfiniteQuery = <T = unknown>(
    endpoint: string,
    params: ListParams = {},
    options: InfiniteOptions<T> = {}
) => {
    const [requestConfig, queryOptions] = splitOptions(options);

    return useTanstackInfiniteQuery<CursorPaginated<T>, ApiError, InfiniteList<T>, QueryKey, string | null>({
        queryKey: [endpoint, params, "infinite"],

        queryFn: async ({ pageParam, signal }) => {
            const pageParams = pageParam ? { ...params, cursor: pageParam } : params;

            const { data } = await http.get<CursorPaginated<T>>(endpoint, {
                params: pageParams,
                signal,
                ...requestConfig,
            });
            return data;
        },

        initialPageParam: null,

        getNextPageParam: (lastPage) => {
            const hasMore = lastPage?.pagination?.hasMore;
            const nextCursor = lastPage?.pagination?.nextCursor;
            return hasMore && nextCursor ? nextCursor : undefined;
        },

        select: (result) => ({
            ...result,
            items: result.pages.flatMap((page) => page?.data ?? []),
        }),

        ...queryOptions,
    });
};