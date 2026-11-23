"use client"
import type { ProductCategoryNode } from "@/types/category"
import type { Product as ProductModel } from "@/types/product"
import type { CursorPaginated } from "@/types/api"
import { useState } from "react"
import { useHomeProducts } from "@/services/product.service"
import { useSavedProductIds } from "@/services/wishlist.service"
import Link from "next/link"
import { MdCoffee, MdEmojiFoodBeverage, MdBakeryDining, MdGridView, MdEco, MdArrowForward } from "react-icons/md"
import { Stagger, Item } from "@/components/modules/motion"
import Product from "@/components/modules/product/product"

const iconFor = (name = "") => {
    const n = name.toLowerCase()
    if (n.includes("coffee")) return MdCoffee
    if (n.includes("tea") || n.includes("herb")) return MdEmojiFoodBeverage
    if (n.includes("snack") || n.includes("bak") || n.includes("nut")) return MdBakeryDining
    return MdEco
}

export default function ShopShelf({ initialPage, categories = [] }: { initialPage?: CursorPaginated<ProductModel> | null; categories?: Pick<ProductCategoryNode, "_id" | "name" | "slug">[] }) {
    const [active, setActive] = useState<string>("")
    const activeCategory = categories.find(({ slug }) => slug === active)
    const savedIds = useSavedProductIds()
    const { data, isFetching, isPlaceholderData, isError, refetch } = useHomeProducts(active, initialPage)
    const list = data?.data ?? []
    const switching = isFetching && isPlaceholderData

    const tab = (on: boolean) => `btn !gap-1.5 !px-3 sm:!px-4 ${on ? "btn-primary" : "btn-outline"}`

    return (
        <>
            {categories.length > 0 && (
                <div className="mb-7 flex flex-wrap justify-center gap-2 sm:mb-9" role="group" aria-label="Filter shop by category">
                    <button type="button" aria-pressed={!active} className={tab(!active)} onClick={() => setActive("")}>
                        <MdGridView aria-hidden className="text-base" />All
                    </button>
                    {categories.map((c) => {
                        const Icon = iconFor(c.name)
                        return (
                            <button key={c._id} type="button" aria-pressed={active === c.slug} className={tab(active === c.slug)} onClick={() => setActive(c.slug)}>
                                <Icon aria-hidden className="text-base" />{c.name}
                            </button>
                        )
                    })}
                </div>
            )}

            <div aria-busy={isFetching}>
                {isError && list.length === 0 ? (
                    <div className="rounded-2xl border border-line bg-surface px-4 py-9 text-center" role="status">
                        <p className="mb-4 text-muted">Couldn’t load products in this category.</p>
                        <button type="button" className="btn btn-outline" onClick={() => void refetch()}>Try again</button>
                    </div>
                ) : list.length === 0 && !isFetching ? (
                    <p className="py-10 text-center text-muted">Nothing here yet. <Link href="/products" className="text-link hover:underline">See the whole store</Link></p>
                ) : (
                    <Stagger key={active + String(isPlaceholderData)} gap={0.04} className={`grid grid-cols-2 gap-2.5 transition-opacity sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5 ${switching ? "opacity-60" : ""}`}>
                        {list.map((item, index) => (
                            <Item key={item._id || index} y={16}>
                                <Product id={item._id} name={item.name} img={item.img}
                                    shortDescription={item.shortDescription} score={item.score} price={item.price} variants={item.variants}
                                    saved={savedIds.has(String(item._id))} />
                            </Item>
                        ))}
                    </Stagger>
                )}
            </div>

            <div className="mt-8 flex justify-center">
                <Link href={activeCategory ? `/products?category=${encodeURIComponent(activeCategory.slug)}` : "/products"} className="btn btn-outline">
                    {activeCategory ? `See all ${activeCategory.name}` : "View all products"}<MdArrowForward aria-hidden />
                </Link>
            </div>
        </>
    )
}
