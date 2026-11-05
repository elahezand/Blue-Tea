import { Stagger, Item, Reveal, SectionHeader } from "@/components/modules/motion";
import Product from "@/components/modules/product/product";
import Image from "next/image";
import Link from "next/link";

/* Shelf: one big featured product on the left, four small ones beside it. Header sits on the left. */
export default function Products({ products = [] }) {
    const [lead, ...rest] = products.slice(0, 5)
    if (!lead) return null
    return (
        <section className="!py-14 lg:!py-20">
            <div className="container">
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <SectionHeader align="start" script="Take a little home" title="From the shop" className="!mb-0" />
                    <Link href="/products" className="link-more">View all products</Link>
                </div>
                <div className="grid gap-4 lg:grid-cols-12">
                    <Reveal y={18} className="lg:col-span-5">
                        <Link href={`/products/${lead._id}`} className="group relative block aspect-[4/5] h-full min-h-[360px] w-full overflow-hidden rounded-3xl bg-soft shadow-sm lg:aspect-auto">
                            <Image src={lead.img} alt={lead.name || ""} fill sizes="(min-width: 1024px) 40vw, 100vw"
                                className="no-tint object-cover transition duration-700 group-hover:scale-105" />
                            <span aria-hidden className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#0a1936]/85 to-transparent" />
                            <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-white">
                                <span className="min-w-0">
                                    <span className="script block text-2xl text-[#bff0d5]">Most loved</span>
                                    <span className="block truncate font-display text-2xl">{lead.name}</span>
                                    <span className="mt-0.5 line-clamp-1 block text-sm text-white/75">{lead.shortDescription}</span>
                                </span>
                                <span className="shrink-0 rounded-full bg-white px-4 py-2 font-display text-lg font-semibold text-[#0a1936]">${lead.price}</span>
                            </span>
                        </Link>
                    </Reveal>
                    <Stagger gap={0.05} className="grid grid-cols-2 gap-3 lg:col-span-7">
                        {rest.map((item, index) => (
                            <Item key={item._id || index} y={18}>
                                <Product id={item._id} name={item.name} img={item.img}
                                    shortDescription={item.shortDescription}
                                    score={item.score} price={item.price} />
                            </Item>
                        ))}
                    </Stagger>
                </div>
            </div>
        </section>
    );
}
