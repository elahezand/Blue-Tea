import Link from "next/link"
import { MdStar, MdInventory2, MdLocalCafe, MdSupportAgent } from "react-icons/md"
import ProductImage from "./productImage"
import ProductComments from "./productComments"
import AddToCart from "./addToCart"
import BrewGuide from "./BrewGuide"
import { firstImage, formatPrice } from "@/utils/helper"
import type { CursorPaginated } from "@/types/api"
import type { Comment } from "@/types/comment"
import type { Product } from "@/types/product"

interface ProductViewProps {
    product: Product
    comments: CursorPaginated<Comment> | null
}

export default function ProductView({ product, comments }: ProductViewProps) {
    return (
        <div className="container pt-8 pb-24 lg:pb-28">
            <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted">
                <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
                    <li><Link href="/" className="hover:text-link">Home</Link></li>
                    <li aria-hidden className="text-line">/</li>
                    <li><Link href="/products" className="hover:text-link">Store</Link></li>
                    <li aria-hidden className="text-line">/</li>
                    <li className="text-fg" aria-current="page">{product.name}</li>
                </ol>
            </nav>

            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
                <ProductImage src={firstImage(product.img)} name={product.name} />

                <div className="lg:sticky lg:top-24 lg:self-start">
                    <p className="script m-0 text-2xl text-[var(--script)]">Take a little home</p>
                    <h1 className="mb-2 mt-1 text-3xl leading-[1.15] font-semibold text-[var(--head)] md:text-4xl">{product.name}</h1>
                    {(product.origin || product.notes?.length) && (
                        <p className="mb-4 text-sm text-muted">
                            {product.origin && <span className="font-medium text-fg">{product.origin}</span>}
                            {product.origin && product.notes?.length ? " · " : ""}
                            {product.notes?.length ? `notes of ${product.notes.join(", ")}` : ""}
                        </p>
                    )}
                    <div className="mb-5 flex items-center gap-4">
                        <span className="price-tag !rotate-[-2deg] !py-1.5">
                            <span className="font-display text-2xl font-semibold">{formatPrice(product.price)}</span>
                            <span className="ms-1 text-sm text-muted">/ 100 g</span>
                        </span>
                        {product.score ? <span className="inline-flex items-center gap-1 text-sm text-muted"><MdStar className="text-base text-[var(--lamp)]" />{product.score} / 5</span> : null}
                    </div>
                    {product.shortDescription && <p className="mb-6 max-w-prose leading-relaxed text-muted">{product.shortDescription}</p>}

                    <div className="border-t-2 border-dotted border-line pt-6">
                        <AddToCart productID={String(product._id)} name={product.name} price={product.price} variants={product.variants} />
                    </div>

                    <BrewGuide brewTemp={product.brewTemp} brewTime={product.brewTime} brewAmount={product.brewAmount} />

                </div>
            </div>

            <div className="mt-14 grid gap-8 border-t-2 border-dotted border-line pt-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-12">
                <div>
                    <h2 className="mb-3 text-xl font-semibold text-[var(--head)]">About this item</h2>
                    <p className="m-0 max-w-3xl leading-[1.9] text-muted">{product.longDescription || product.shortDescription}</p>
                </div>

                <div className="rounded-2xl border border-dashed border-line bg-soft/60 p-6 lg:self-start">
                    <h2 className="mb-4 text-lg font-semibold text-[var(--head)]">Good to know</h2>
                    <ul className="m-0 grid list-none gap-4 p-0 text-sm text-muted">
                        <li className="flex items-start gap-3"><MdInventory2 className="mt-0.5 shrink-0 text-lg text-[var(--green-text)]" aria-hidden /><span><span className="font-medium text-fg">Keep it fresh.</span> Store it sealed, away from light, heat and damp.</span></li>
                        <li className="flex items-start gap-3"><MdLocalCafe className="mt-0.5 shrink-0 text-lg text-[var(--green-text)]" aria-hidden /><span><span className="font-medium text-fg">Want to try it first?</span> Ask for a cup at the counter.</span></li>
                        <li className="flex items-start gap-3"><MdSupportAgent className="mt-0.5 shrink-0 text-lg text-[var(--green-text)]" aria-hidden /><span><span className="font-medium text-fg">Questions?</span> <Link href="/contact-us" className="hover:text-link">Write to us</Link> and we will help you choose.</span></li>
                    </ul>
                </div>
            </div>

            <ProductComments productID={String(product._id)} initialPage={comments} />
        </div>
    )
}