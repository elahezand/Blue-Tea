"use client"
import type { ProductCategoryNode } from "@/types/category"
import type { Product as ProductModel } from "@/types/product"
import type { CursorPaginated } from "@/types/api"
import { useState } from "react"
import { useHomeProducts } from "@/services/product.service"
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

export default function ShopShelf({ initialPage, categories = [] }: { initialPage?: CursorPaginated<ProductModel> | null; categories?: Pick<ProductCategoryNode, "_id" | "name">[] }) {
    const [active, setActive] = useState<string>("")
    const { data, isFetching, isPlaceholderData } = useHomeProducts(active, initialPage)
    const list = data?.data ?? []
    const switching = isFetching && isPlaceholderData 

    const tab = (on: boolean) => `inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-solid px-4 py-2 text-sm font-medium transition-colors ${on ? "border-brown bg-brown text-white shadow-sm" : "border-line bg-surface text-fg hover:border-brown/50"}`

    return (
        <>
            {categories.length > 0 && (
                <div className="-mx-3 mb-7 flex gap-2 overflow-x-auto px-3 pb-1 sm:-mx-4 sm:px-4 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0" role="tablist" aria-label="Shop categories">
                    <button type="button" role="tab" aria-selected={!active} className={tab(!active)} onClick={() => setActive("")}>
                        <MdGridView className="text-lg" />All
                    </button>
                    {categories.map((c) => {
                        const Icon = iconFor(c.name)
                        return (
                            <button key={c._id} type="button" role="tab" aria-selected={active === c.name} className={tab(active === c.name)} onClick={() => setActive(c.name)}>
                                <Icon className="text-lg" />{c.name}
                            </button>
                        )
                    })}
                </div>
            )}

            {list.length === 0 && !isFetching ? (
                <p className="py-10 text-center text-muted">Nothing here yet. <Link href="/products" className="text-link hover:underline">See the whole store</Link></p>
            ) : (
                <Stagger key={active + String(isPlaceholderData)} gap={0.05} className={`grid grid-cols-2 gap-3 transition-opacity md:grid-cols-3 lg:grid-cols-4 ${switching ? "opacity-60" : ""}`}>
                    {list.map((item, index) => (
                        <Item key={item._id || index} y={16}>
                            <Product id={item._id} name={item.name} img={item.img}
                                shortDescription={item.shortDescription} score={item.score} price={item.price} variants={item.variants} />
                        </Item>
                    ))}
                </Stagger>
            )}

            <div className="mt-8 flex justify-center">
                <Link href={active ? `/products?category=${encodeURIComponent(active)}` : "/products"} className="link-more inline-flex items-center gap-1.5">
                    {active ? `See all ${active}` : "View all products"}<MdArrowForward aria-hidden />
                </Link>
            </div>
        </>
    )
}