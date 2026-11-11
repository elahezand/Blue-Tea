"use client"
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MdTune } from "react-icons/md"
import Loader, { Spinner } from "@/components/feedBack/Loader"
import Product from "@/components/modules/product/product";
import useDebounce from "@/hooks/useDebounce";
import { useInfiniteProducts, type ProductQuery } from "@/services/product.service";
import { PRODUCTS_PER_PAGE } from "@/utils/constant";
import { toQueryString } from "@/utils/helper";
import type { CursorPaginated } from "@/types/api";
import type { Product as ProductModel, ProductCategoryNode } from "@/types/models";

interface ProductsListProps {
    initialPage: CursorPaginated<ProductModel> | null
    initialCategory?: string
    categories?: Pick<ProductCategoryNode, "_id" | "name">[]
}

type Filters = Required<Pick<ProductQuery, "category" | "q" | "min" | "max" | "sort">>

const MIN_LENGTH = 2
const DEBOUNCE_MS = 300

const writeUrl = (filters: Filters, push = false) => {
    const url = `/products${toQueryString(filters)}`
    if (push) window.history.pushState(null, "", url)
    else window.history.replaceState(null, "", url)
}

export default function ProductsList({ initialPage, initialCategory = "", categories = [] }: ProductsListProps) {
    const searchParams = useSearchParams()
    const filters: Filters = {
        category: searchParams.get("category") || "",
        q: (searchParams.get("q") || "").trim().slice(0, 60),
        min: searchParams.get("min") || "",
        max: searchParams.get("max") || "",
        sort: searchParams.get("sort") || "",
    }
    const setFilters = (next: Partial<Filters>, push = false) => writeUrl({ ...filters, ...next }, push)

    const [text, setText] = useState(filters.q)
    const typed = useDebounce(text.trim(), DEBOUNCE_MS)
   
    useEffect(() => {
        const next = typed.length >= MIN_LENGTH ? typed : ""
        const current = new URLSearchParams(window.location.search).get("q") || ""
        if (next !== current) writeUrl({ ...readUrl(), q: next })
    }, [typed])

    const [min, setMin] = useState(filters.min)
    const [max, setMax] = useState(filters.max)
    const [showFilters, setShowFilters] = useState(false)

    const sameAsServer = filters.category === initialCategory && !filters.q && !filters.min && !filters.max && !filters.sort
   
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isFetching, isPlaceholderData, isError, refetch } = useInfiniteProducts(
        { ...filters, limit: PRODUCTS_PER_PAGE },
        sameAsServer && initialPage ? initialPage : undefined,
    )
    const products = data?.items ?? []
    const updating = isFetching && isPlaceholderData 

    const reset = () => {
        setText(""); setMin(""); setMax("")
        writeUrl({ category: "", q: "", min: "", max: "", sort: "" }, true)
    }

    const chip = (on: boolean) => `cursor-pointer whitespace-nowrap rounded-full border border-solid px-4 py-1.5 text-sm font-medium transition-colors ${on ? "border-brown bg-brown text-white" : "border-line bg-surface text-fg hover:border-brown/50"}`;

    return (
        <div className="container pt-4 pb-14">
            <form onSubmit={(e) => { e.preventDefault(); setFilters({ min, max }) }} className="mb-6 flex flex-col gap-4 border-b border-line pb-6">
                {categories.length > 0 && (
                    <div className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1 sm:-mx-4 sm:px-4 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0" role="group" aria-label="Category">
                        <button type="button" className={chip(!filters.category)} aria-pressed={!filters.category} onClick={() => setFilters({ category: "" }, true)}>All</button>
                        {categories.map((c) => (
                            <button key={c._id} type="button" className={chip(filters.category === c.name)} aria-pressed={filters.category === c.name} onClick={() => setFilters({ category: c.name }, true)}>{c.name}</button>
                        ))}
                    </div>
                )}
                <button type="button" onClick={() => setShowFilters((v) => !v)} aria-expanded={showFilters} aria-controls="filter-fields"
                    className="flex w-fit cursor-pointer items-center gap-2 rounded-full border border-solid border-line bg-surface px-4 py-2 text-sm font-medium text-fg md:hidden">
                    <MdTune className="text-lg" />{showFilters ? "Hide filters" : "Search, price and sort"}
                </button>
                <div id="filter-fields" className={`${showFilters ? "flex" : "hidden"} flex-wrap items-end gap-3 md:flex`}>
                    <div className="min-w-48 flex-1">
                        <label htmlFor="f-name" className="field-label !mb-1 text-xs">Search by name</label>
                        <input id="f-name" type="search" value={text} maxLength={60} enterKeyHint="search"
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); e.currentTarget.blur() } }}
                            placeholder="Sencha, beans, teapot..." className="field field-sm !rounded-full !px-4 !py-2" />
                    </div>
                    <div>
                        <label htmlFor="f-min" className="field-label !mb-1 text-xs">Price</label>
                        <div className="flex items-center gap-2">
                            <input id="f-min" type="number" min={0} value={min} onChange={(e) => setMin(e.target.value)} placeholder="Min" aria-label="Minimum price" className="field field-sm !w-24 !rounded-full !px-4 !py-2" />
                            <span className="text-muted" aria-hidden>-</span>
                            <input type="number" min={0} value={max} onChange={(e) => setMax(e.target.value)} placeholder="Max" aria-label="Maximum price" className="field field-sm !w-24 !rounded-full !px-4 !py-2" />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" className="classic !px-5 !py-2">Apply</button>
                        <button type="button" onClick={reset} className="cursor-pointer rounded-full border border-solid border-line bg-transparent px-5 py-2 text-sm font-medium text-fg transition hover:bg-soft">Reset</button>
                    </div>
                    <div className="ms-auto flex items-center gap-2">
                        <label htmlFor="sort" className="text-sm text-muted">Sort by</label>
                        <select id="sort" value={filters.sort} onChange={(e) => setFilters({ sort: e.target.value })} className="field field-sm !w-auto !rounded-full !px-4 !py-2">
                            <option value="">Featured</option>
                            <option value="price-asc">Price: low to high</option>
                            <option value="price-desc">Price: high to low</option>
                            <option value="rating">Top rated</option>
                        </select>
                    </div>
                </div>
            </form>

            {isLoading ? (
                <Loader inline label="Finding products" />
            ) : isError && !products.length ? (
                <div className="rounded-[2rem] bg-soft px-6 py-12 text-center" role="alert">
                    <h2 className="mb-2 text-2xl text-fg">We couldn&apos;t load the store</h2>
                    <p className="mb-5 text-sm text-muted">Please check your connection and try again.</p>
                    <button type="button" onClick={() => refetch()} disabled={isFetching} className="btn-organic cursor-pointer bg-brown px-7 py-2.5 text-sm font-medium text-white">
                        {isFetching ? <Spinner label="Trying" /> : "Try again"}
                    </button>
                </div>
            ) : (
                <>
                    <p className="mb-4 text-sm text-muted" aria-live="polite">
                        {updating ? "Updating..." : `${products.length}${hasNextPage ? "+" : ""} ${products.length === 1 ? "product" : "products"}`}
                    </p>

                    {products.length === 0 && (
                        <div className="rounded-[2rem] bg-soft px-6 py-12 text-center">
                            <h2 className="mb-2 text-2xl text-fg">No products match</h2>
                            <p className="mb-5 text-sm text-muted">Try a different name or price range, or clear the filters.</p>
                            <button type="button" onClick={reset} className="btn-organic cursor-pointer bg-brown px-7 py-2.5 text-sm font-medium text-white">Clear filters</button>
                        </div>
                    )}
                    <div className={`grid grid-cols-2 gap-3 transition-opacity md:grid-cols-3 lg:grid-cols-4 ${updating ? "opacity-60" : ""}`}>
                        {products.map((item) => (
                            <Product key={item._id} id={item._id} name={item.name} img={item.img} shortDescription={item.shortDescription}
                                score={item.score} price={item.price} variants={item.variants} />
                        ))}
                    </div>

                    {hasNextPage && (
                        <div className="mt-10 text-center">
                            <button type="button" onClick={() => fetchNextPage()} className="btn-organic bg-surface px-8 py-2.5 text-sm font-medium text-fg" disabled={isFetchingNextPage}>
                                {isFetchingNextPage ? <Spinner label="Loading" /> : "Load more"}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function readUrl(): Filters {
    const sp = new URLSearchParams(window.location.search)
    return { category: sp.get("category") || "", q: sp.get("q") || "", min: sp.get("min") || "", max: sp.get("max") || "", sort: sp.get("sort") || "" }
}
