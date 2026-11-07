"use client"
import { MdTune } from "react-icons/md"
import { Spinner } from "@/components/feedBack/Loader"
import { useState } from "react";
import Product from "@/components/modules/product/product";
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import qs from "qs";
import type { Product as ProductModel } from "@/types/models";
import type { SearchParams } from "@/types/api";

interface ProductsListProps {
    data: ProductModel[]
    categoryName?: string
    limit?: number
    nextCursor?: string | null
    params?: SearchParams
}

interface Filters {
    category: string
    min: string
    max: string
    value: string
    cursor?: string | null
    limit?: number
}

export default function ProductsList({ data: initialData, categoryName, limit, nextCursor }: ProductsListProps) {
    const [products, setProducts] = useState<ProductModel[]>(initialData);
    const [loading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [sort, setSort] = useState("");
    
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams(); 
    
    const [params, setParams] = useState<Filters>({
        category: searchParams.get("category") || categoryName || "",
        min: searchParams.get("min") || "",
        max: searchParams.get("max") || "",
        value: searchParams.get("value") || "",
        cursor: nextCursor,
        limit
    });

    const applyFilters = (override: Partial<Filters> = {}) => {
        const nextParams: Filters = { ...params, ...override, cursor: null };
        setParams(nextParams);

        const cleanForUrl = Object.fromEntries(
            Object.entries(nextParams).filter(([, v]) => v !== "" && v != null)
        );
        router.push(`${pathname}?${qs.stringify(cleanForUrl, { encode: false })}`, { scroll: false });
        // TODO: filter request (removed for now): GET /products with nextParams -> setProducts(data), cursor = nextCursor
    };

    const loadMore = () => {
        if (!params.cursor || loading) return;
        // TODO: load-more request (removed for now): GET /products with params -> append data, cursor = nextCursor
    };

    const handleReset = () => {
        const resetParams: Filters = { category: "", min: "", max: "", value: "", limit, cursor: null };
        setParams(resetParams);
        setProducts(initialData); 
        router.push(pathname, { scroll: false });
    };

    const shown = [...products].sort((a, b) =>
        sort === "price-asc" ? a.price - b.price : sort === "price-desc" ? b.price - a.price : sort === "rating" ? (b.score || 0) - (a.score || 0) : 0);

    const categories = ["Coffee", "Herbal Teas", "Organic Snacks"];
    const chip = (on: boolean) => `cursor-pointer whitespace-nowrap rounded-full border border-solid px-4 py-1.5 text-sm font-medium transition-colors ${on ? "border-brown bg-brown text-white" : "border-line bg-surface text-fg hover:border-brown/50"}`;

    return (
        <div className="container pt-4 pb-14">
            {/* Filters: one quiet row above the products */}
            <form onSubmit={(e) => { e.preventDefault(); applyFilters(); }} className="mb-6 flex flex-col gap-4 border-b border-line pb-6">
                <div className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1 sm:-mx-4 sm:px-4 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0" role="group" aria-label="Category">
                    <button type="button" className={chip(!params.category)} aria-pressed={!params.category} onClick={() => applyFilters({ category: "" })}>All</button>
                    {categories.map((item) => (
                        <button key={item} type="button" className={chip(params.category === item)} aria-pressed={params.category === item} onClick={() => applyFilters({ category: item })}>{item}</button>
                    ))}
                </div>
                <button type="button" onClick={() => setShowFilters((v) => !v)} aria-expanded={showFilters} aria-controls="filter-fields"
                    className="flex w-fit cursor-pointer items-center gap-2 rounded-full border border-solid border-line bg-surface px-4 py-2 text-sm font-medium text-fg md:hidden">
                    <MdTune className="text-lg" />{showFilters ? "Hide filters" : "Search, price and sort"}
                </button>
                <div id="filter-fields" className={`${showFilters ? "flex" : "hidden"} flex-wrap items-end gap-3 md:flex`}>
                    <div className="min-w-48 flex-1">
                        <label htmlFor="f-name" className="field-label !mb-1 text-xs">Search by name</label>
                        <input id="f-name" type="text" value={params.value}
                            onChange={(e) => setParams(prev => ({ ...prev, value: e.target.value }))}
                            placeholder="Sencha, beans, teapot..." className="field field-sm !rounded-full !px-4 !py-2" />
                    </div>
                    <div>
                        <label htmlFor="f-min" className="field-label !mb-1 text-xs">Price (EUR)</label>
                        <div className="flex items-center gap-2">
                            <input id="f-min" type="number" value={params.min} onChange={(e) => setParams(prev => ({ ...prev, min: e.target.value }))} placeholder="Min" aria-label="Minimum price" className="field field-sm !w-24 !rounded-full !px-4 !py-2" />
                            <span className="text-muted" aria-hidden>-</span>
                            <input type="number" value={params.max} onChange={(e) => setParams(prev => ({ ...prev, max: e.target.value }))} placeholder="Max" aria-label="Maximum price" className="field field-sm !w-24 !rounded-full !px-4 !py-2" />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" className="classic !px-5 !py-2" disabled={loading}>{loading ? "..." : "Apply"}</button>
                        <button type="button" onClick={handleReset} className="cursor-pointer rounded-full border border-solid border-line bg-transparent px-5 py-2 text-sm font-medium text-fg transition hover:bg-soft">Reset</button>
                    </div>
                    <div className="ms-auto flex items-center gap-2">
                        <label htmlFor="sort" className="text-sm text-muted">Sort by</label>
                        <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)} className="field field-sm !w-auto !rounded-full !px-4 !py-2">
                            <option value="">Featured</option>
                            <option value="price-asc">Price: low to high</option>
                            <option value="price-desc">Price: high to low</option>
                            <option value="rating">Top rated</option>
                        </select>
                    </div>
                </div>
            </form>

            <p className="mb-4 text-sm text-muted" aria-live="polite">{products.length} {products.length === 1 ? "product" : "products"}</p>

            {products.length === 0 && (
                <div className="rounded-[2rem] bg-soft px-6 py-12 text-center">
                    <h2 className="mb-2 text-2xl text-fg">No products match</h2>
                    <p className="mb-5 text-sm text-muted">Try a different name or price range, or clear the filters.</p>
                    <button type="button" onClick={handleReset} className="btn-organic cursor-pointer bg-brown px-7 py-2.5 text-sm font-medium text-white">Clear filters</button>
                </div>
            )}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {shown.map((item, index) => (
                    <Product key={item._id || index} id={item._id} name={item.name} img={item.img} shortDescription={item.shortDescription} score={item.score} price={item.price} />
                ))}
            </div>

            {params.cursor && (
                <div className="mt-10 text-center">
                    <button onClick={loadMore} className="btn-organic bg-surface px-8 py-2.5 text-sm font-medium text-fg" disabled={loading}>
                        {loading ? <Spinner label="Loading" /> : "Load more"}
                    </button>
                </div>
            )}
        </div>
    );
}
