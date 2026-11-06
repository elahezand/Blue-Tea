"use client"
import { useMemo, useState } from "react"
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

/* Category tabs on top, then one even grid of products. */
export default function ShopShelf({ products = [], categories = [] }) {
    const [active, setActive] = useState("all")

    // only offer shelves that actually have something on them
    const shelves = useMemo(() => categories
        .map((c) => ({ ...c, count: products.filter((p) => String(p.category) === String(c._id)).length }))
        .filter((c) => c.count > 0), [categories, products])

    const current = shelves.find((c) => c._id === active)
    const list = (current ? products.filter((p) => String(p.category) === String(current._id)) : products).slice(0, 8)

    const tab = (on) => `inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-solid px-4 py-2 text-sm font-medium transition-colors ${on ? "border-brown bg-brown text-white shadow-sm" : "border-line bg-surface text-fg hover:border-brown/50"}`

    return (
        <>
            {shelves.length > 0 && (
                <div className="-mx-3 mb-7 flex gap-2 overflow-x-auto px-3 pb-1 sm:-mx-4 sm:px-4 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0" role="tablist" aria-label="Shop categories">
                    <button type="button" role="tab" aria-selected={active === "all"} className={tab(active === "all")} onClick={() => setActive("all")}>
                        <MdGridView className="text-lg" />All
                    </button>
                    {shelves.map((c) => {
                        const Icon = iconFor(c.name)
                        return (
                            <button key={c._id} type="button" role="tab" aria-selected={active === c._id} className={tab(active === c._id)} onClick={() => setActive(c._id)}>
                                <Icon className="text-lg" />{c.name}
                                <span className={`rounded-full px-1.5 text-xs ${active === c._id ? "bg-white/20" : "bg-soft text-muted"}`}>{c.count}</span>
                            </button>
                        )
                    })}
                </div>
            )}

            <Stagger key={active} gap={0.05} className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {list.map((item, index) => (
                    <Item key={item._id || index} y={16}>
                        <Product id={item._id} name={item.name} img={item.img}
                            shortDescription={item.shortDescription} score={item.score} price={item.price} />
                    </Item>
                ))}
            </Stagger>

            <div className="mt-8 flex justify-center">
                <Link href={current ? `/products?category=${encodeURIComponent(current.name)}` : "/products"} className="link-more inline-flex items-center gap-1.5">
                    {current ? `See all ${current.name}` : "View all products"}<MdArrowForward aria-hidden />
                </Link>
            </div>
        </>
    )
}
