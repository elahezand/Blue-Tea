"use client"
import { useEffect } from "react"
import { useAddArticleView } from "@/services/article.service"
import type { ID } from "@/types/api"

export default function ArticleView({ id }: { id: ID }) {
    const { mutate } = useAddArticleView(id)

    useEffect(() => {
        const key = `viewed-article-${id}`
        try {
            if (sessionStorage.getItem(key)) return
            sessionStorage.setItem(key, "1")
        } catch {}
        mutate(undefined)
    }, [id, mutate])

    return null
}