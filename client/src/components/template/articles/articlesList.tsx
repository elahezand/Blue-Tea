"use client"
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MdSearch, MdClose } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import Loader, { Spinner } from "@/components/feedback/loader"
import { useInfiniteArticles } from "@/services/article.service";
import useDebounce from "@/hooks/useDebounce";
import type { CursorPaginated } from "@/types/api";
import type { Article } from "@/types/article"

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
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isPlaceholderData, isFetching } = useInfiniteArticles(q || undefined, initialPage);
    const searching = isFetching && isPlaceholderData;
    const articles = data?.items ?? [];

    const loadMore = () => {
        if (!hasNextPage || isFetchingNextPage) return;
        fetchNextPage();
    };

    const clear = () => { setText(""); setSearchInUrl(""); };

    return (
        <div>
            <div role="search" className="mb-4 flex max-w-xl items-center gap-2 rounded-full border border-solid border-line bg-surface py-1.5 pr-2 pl-5 focus-within:border-brown focus-within:ring-4 focus-within:ring-brown/15">
                <MdSearch aria-hidden className="shrink-0 text-xl text-muted" />
                <input type="search" value={text} onChange={(e) => setText(e.target.value)} enterKeyHint="search"
                    onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur() }} maxLength={60} placeholder="Search the journal"
                    aria-label="Search articles" className="min-w-0 flex-1 border-none bg-transparent py-2 text-base text-fg outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:hidden" />
                {text && (
                    <button type="button" onClick={clear} aria-label="Clear search" className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-lg text-muted hover:bg-soft hover:text-fg"><MdClose /></button>
                )}
            </div>
            <p aria-live="polite" className="mb-6 min-h-5 text-sm text-muted">
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
                            {q && <button type="button" onClick={clear} className="btn btn-outline">Show all articles</button>}
                        </div>
                    )}
                    <div className={`grid gap-x-7 gap-y-9 transition-opacity sm:grid-cols-2 lg:grid-cols-3 ${searching ? "opacity-60" : ""}`}>
                        {articles.map((article, index) => (
                            <article key={article._id} className="min-w-0 border-b border-line pb-5">
                                <Link href={`/articles/${article._id}`} className="group block rounded-xl">
                                    {article.cover && (
                                        <div className="snow-cap relative mb-4 aspect-[4/3] overflow-hidden rounded-xl bg-soft">
                                            <Image src={article.cover} alt="" fill sizes="(min-width: 992px) 32vw, (min-width: 576px) 48vw, 100vw"
                                                priority={index < 3}
                                                className="no-tint object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.035]" />
                                        </div>
                                    )}
                                    <h2 className="mb-2 text-xl leading-snug text-fg transition-colors group-hover:text-link sm:text-2xl">{article.title}</h2>
                                    {article.shortDescription && <p className="mb-2 line-clamp-2 text-sm text-muted">{article.shortDescription}</p>}
                                    {article.author && <p className="m-0 text-xs text-muted">{article.author}</p>}
                                </Link>
                            </article>
                        ))}
                    </div>
                    {hasNextPage && (
                        <div className="mt-10 text-center">
                            <button onClick={loadMore} className="btn btn-outline" disabled={isFetchingNextPage}>
                                {isFetchingNextPage ? <Spinner label="Loading" /> : "Load more"}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
