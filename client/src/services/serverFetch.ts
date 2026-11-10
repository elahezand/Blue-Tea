import { toApiError } from "@/utils/apiError"

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface ServerFetchOptions {
    endpoint: string
    cacheKey?: string
    revalidateTime?: number
}

export default async function serverFetch<T>({ endpoint, cacheKey, revalidateTime = 60 }: ServerFetchOptions): Promise<T> {
    let res: Response
    try {
        res = await fetch(`${API_URL}${endpoint}`, {
            headers: { Accept: "application/json" },
            ...(cacheKey
                ? { next: { revalidate: revalidateTime, tags: [cacheKey] } }
                : { cache: "no-store" as const }),
        })
    } catch (error) {
        console.error("SSR fetch error:", endpoint, (error as Error)?.message)
        throw toApiError(error)
    }

    const body: unknown = await res.json().catch(() => null)
    if (!res.ok) {
        console.error("SSR fetch error:", endpoint, res.status)
        throw toApiError({ response: { status: res.status, data: body } })
    }
    return body as T
}