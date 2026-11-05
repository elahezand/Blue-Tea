"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'

/* Page links that keep every filter in the URL. `href` is kept only so old callers still work. */
export default function Pagination({ pageCount, currentPage, limit }) {
    const pathname = usePathname()
    const sp = useSearchParams()
    const current = Number(currentPage) || 1
    if (!pageCount || pageCount <= 1) return null

    const to = (p) => {
        const q = new URLSearchParams(sp.toString())
        q.set("page", p)
        if (limit) q.set("limit", limit)
        return `${pathname}?${q}`
    }
    // 1 … 4 5 6 … 20
    const pages = [...new Set([1, current - 1, current, current + 1, pageCount].filter((p) => p >= 1 && p <= pageCount))].sort((a, b) => a - b)
    const item = "flex size-9 items-center sm:size-10 justify-center rounded-full border border-solid text-sm font-medium transition-colors"

    return (
        <nav aria-label="Pages" className="my-8">
            <ul className="m-0 flex list-none flex-wrap items-center justify-center gap-1.5 p-0 sm:gap-2">
                <li>{current > 1
                    ? <Link href={to(current - 1)} aria-label="Previous page" className={`${item} border-line bg-surface text-fg hover:border-brown/50`}><MdChevronLeft className="text-xl" /></Link>
                    : <span aria-hidden className={`${item} border-line bg-surface text-muted opacity-50`}><MdChevronLeft className="text-xl" /></span>}</li>
                {pages.map((p, i) => (
                    <React.Fragment key={p}>
                        {i > 0 && p - pages[i - 1] > 1 && <li aria-hidden className="px-1 text-muted">…</li>}
                        <li>
                            <Link href={to(p)} aria-label={`Page ${p}`} aria-current={p === current ? "page" : undefined}
                                className={`${item} ${p === current ? "border-brown bg-brown !text-white" : "border-line bg-surface text-fg hover:border-brown/50"}`}>{p}</Link>
                        </li>
                    </React.Fragment>
                ))}
                <li>{current < pageCount
                    ? <Link href={to(current + 1)} aria-label="Next page" className={`${item} border-line bg-surface text-fg hover:border-brown/50`}><MdChevronRight className="text-xl" /></Link>
                    : <span aria-hidden className={`${item} border-line bg-surface text-muted opacity-50`}><MdChevronRight className="text-xl" /></span>}</li>
            </ul>
        </nav>
    )
}
