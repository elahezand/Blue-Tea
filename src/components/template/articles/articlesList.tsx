"use client"
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { keepPreviousData } from "@tanstack/react-query";
import { MdSearch, MdClose } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import Loader, { Spinner } from "@/components/feedBack/Loader"
import { useInfiniteQuery } from "@/hooks/useApi";
import useDebounce from "@/hooks/useDebounce";
import { ENDPOINTS, ARTICLES_PER_PAGE } from "@/utils/constant";
import type { ArticleQuery, CursorPaginated } from "@/types/api";
import type { Article } from "@/types/models";

interface ArticlesListProps {
    initialPage: CursorPaginated<Article>
}

const MIN_LENGTH = 2     
const DEBOUNCE_MS = 300   
const setSearchInUrl = (q: string) => {
    window.history.replaceState(null, "", q ? `/articles?q=${encodeURIComponent(q)}` : "/articles")
}

export default function ArticlesList({ initialPage }: ArticlesListProps) {
    const q = (useSearchParams().get("q") || "").trim().slice(0, 60);
    const [text, setText] = useState(q);
    const typed = useDebounce(text.trim(), DEBOUNCE_MS);

    useEffect(() => {
        const next = typed.length >= MIN_LENGTH ? typed : "";
        const current = new URLSearchParams(window.location.search).get("q") || "";
        if (next !== current) setSearchInUrl(next);
    }, [typed]);
    const query: ArticleQuery = { q: q || undefined, limit: ARTICLES_PER_PAGE };


    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isPlaceholderData, isFetching } = useInfiniteQuery<Article>(
        ENDPOINTS.ARTICLES,
        { ...query },
        {
            initialData: q ? undefined : { pages: [initialPage], pageParams: [null] },
            placeholderData: keepPreviousData,
        }
    );
    const searching = isFetching && isPlaceholderData;
    const articles = data?.items ?? [];

    const loadMore = () => {
        if (!hasNextPage || isFetchingNextPage) return;
        fetchNextPage();
    };

    const clear = () => { setText(""); setSearchInUrl(""); };

    return (
        <div>
            <div role="search" className="mx-auto mb-10 flex max-w-xl items-center gap-2 rounded-full border border-solid border-line bg-surface py-1.5 pr-2 pl-5 shadow-sm focus-within:border-brown focus-within:ring-4 focus-within:ring-brown/15">
                <MdSearch aria-hidden className="shrink-0 text-xl text-muted" />
                <input type="search" value={text} onChange={(e) => setText(e.target.value)} enterKeyHint="search"
                    onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur() }} maxLength={60} placeholder="Search the journal"
                    aria-label="Search articles" className="min-w-0 flex-1 border-none bg-transparent py-2 text-base text-fg outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:hidden" />
                {text && (
                    <button type="button" onClick={clear} aria-label="Clear search" className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-lg text-muted hover:bg-soft hover:text-fg"><MdClose /></button>
                )}
            </div>
            <p aria-live="polite" className="mb-6 min-h-5 text-center text-sm text-muted">
                {searching ? "Searching..." : q && !isLoading ? (articles.length ? `Results for “${q}”` : "") : ""}
            </p>
            {isLoading ? (
                <Loader inline label="Searching" />
            ) : (
                <>
                    {articles.length === 0 && (
                        <div className="mx-auto max-w-md py-10 text-center">
                            <h2 className="mb-2 text-xl text-fg">{q ? `Nothing found for “${q}”` : "No articles yet"}</h2>
                            <p className="mb-5 text-muted">{q ? "Try a shorter word, or check the spelling." : "Check back soon."}</p>
                            {q && <button type="button" onClick={clear} className="btn-organic bg-surface px-6 py-2.5 text-sm font-medium text-fg">Show all articles</button>}
                        </div>
                    )}
                    <div className={`grid gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-3 ${searching ? "opacity-60" : ""}`}>
                        {articles.map((a, i) => (
                            <Link key={a._id} href={`/articles/${a._id}`} className="group block">
                                <div className="photo mb-4 aspect-[4/3]">
                                    {a.cover && <Image src={a.cover} alt="" width={600} height={450} priority={i < 3}
                                        className="block h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
                                </div>
                                <h2 className="mb-1 text-xl text-fg transition-colors group-hover:text-link">{a.title}</h2>
                                <p className="mb-1 line-clamp-2 text-sm text-muted">{a.shortDescription}</p>
                                <span className="text-xs text-muted">{a.author}</span>
                            </Link>
                        ))}
                    </div>
                    {hasNextPage && (
                        <div className="mt-10 text-center">
                            <button onClick={loadMore} className="btn-organic bg-surface px-8 py-2.5 text-sm font-medium text-fg" disabled={isFetchingNextPage}>
                                {isFetchingNextPage ? <Spinner label="Loading" /> : "Load more"}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}