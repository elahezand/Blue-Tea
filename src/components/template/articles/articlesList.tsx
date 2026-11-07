"use client"
import type React from "react";
import { Spinner } from "@/components/feedBack/Loader"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdSearch, MdClose } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types/models";

interface ArticlesListProps {
    data: Article[]
    limit?: number
    nextCursor?: string | null
    query?: string
}

export default function ArticlesList({ data: initialData, limit, nextCursor = null, query = "" }: ArticlesListProps) {
    const router = useRouter();
    const [text, setText] = useState(query);
    const [articles] = useState<Article[]>(initialData);
    const [cursor] = useState<string | null>(nextCursor);
    const [loading] = useState(false);

    const loadMore = () => {
        if (!cursor || loading) return;
        // TODO: load-more request (removed for now): GET /articles?cursor&limit&q -> append data, set nextCursor
        void limit
    };

    const search = (e: React.FormEvent) => {
        e.preventDefault();
        const v = text.trim();
        router.push(v ? `/articles?q=${encodeURIComponent(v)}` : "/articles", { scroll: false });
    };
    const clear = () => { setText(""); router.push("/articles", { scroll: false }); };

    return (
        <div>
            <form onSubmit={search} role="search" className="mx-auto mb-10 flex max-w-xl items-center gap-2 rounded-full border border-solid border-line bg-surface py-1.5 pr-1.5 pl-5 shadow-sm focus-within:border-brown focus-within:ring-4 focus-within:ring-brown/15">
                <MdSearch aria-hidden className="shrink-0 text-xl text-muted" />
                <input type="search" value={text} onChange={(e) => setText(e.target.value)} placeholder="Search the journal"
                    aria-label="Search articles" className="min-w-0 flex-1 border-none bg-transparent py-2 text-base text-fg outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:hidden" />
                {(text || query) && (
                    <button type="button" onClick={clear} aria-label="Clear search" className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-lg text-muted hover:bg-soft hover:text-fg"><MdClose /></button>
                )}
                <button type="submit" className="btn-organic shrink-0 bg-brown px-6 py-2 text-sm font-medium !text-white">Search</button>
            </form>
            {query && <p className="mb-6 text-center text-sm text-muted">{articles.length ? `Results for “${query}”` : ""}</p>}
            {articles.length === 0 && (
                <div className="mx-auto max-w-md py-10 text-center">
                    <h2 className="mb-2 text-xl text-fg">{query ? `Nothing found for “${query}”` : "No articles yet"}</h2>
                    <p className="mb-5 text-muted">{query ? "Try a shorter word, or check the spelling." : "Check back soon."}</p>
                    {query && <button type="button" onClick={clear} className="btn-organic bg-surface px-6 py-2.5 text-sm font-medium text-fg">Show all articles</button>}
                </div>
            )}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
            {cursor && (
                <div className="mt-10 text-center">
                    <button onClick={loadMore} className="btn-organic bg-surface px-8 py-2.5 text-sm font-medium text-fg" disabled={loading}>
                        {loading ? <Spinner label="Loading" /> : "Load more"}
                    </button>
                </div>
            )}
        </div>
    );
}
