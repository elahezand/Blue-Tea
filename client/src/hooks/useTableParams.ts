"use client"
import { useSearchParams } from "next/navigation"
import type { ListParams } from "@/types/api"

export default function useTableParams(): ListParams {
    const searchParams = useSearchParams()
    const params: ListParams = {}
    searchParams.forEach((value, key) => {
        const clean = value.trim()
        if (clean) params[key] = clean
    })
    return params
}
