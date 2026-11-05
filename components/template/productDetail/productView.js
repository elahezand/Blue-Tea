import Link from "next/link"
import { MdStar } from "react-icons/md"
import ProductGallery from "./ProductGallery"
import ProductComments from "./ProductComments"
import AddToCart from "./addToCart"

/* Presentational layout for /products/[id]. Receives plain, serialisable data. */
export default function ProductView({ product, comments, nextCursor, limit }) {
    const images = product.img
    const first = Array.isArray(images) ? images[0] : images
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
                <ProductGallery images={images} name={product.name} />

                <div className="lg:sticky lg:top-24 lg:self-start">
                    <p className="script m-0 text-2xl text-[var(--green)]">Take a little home</p>
                    <h1 className="mb-3 mt-1 text-3xl leading-[1.15] font-semibold text-[var(--head)] md:text-4xl">{product.name}</h1>
                    <div className="mb-5 flex items-center gap-4">
                        <span className="font-display text-2xl font-semibold text-fg">${product.price}<span className="ms-1 text-sm font-normal text-muted">/ 100 g</span></span>
                        {product.score ? <span className="inline-flex items-center gap-1 text-sm text-muted"><MdStar className="text-base text-[var(--lamp)]" />{product.score} / 5</span> : null}
                    </div>
                    {product.shortDescription && <p className="mb-6 max-w-prose leading-relaxed text-muted">{product.shortDescription}</p>}

                    <div className="border-t-2 border-dotted border-line pt-6">
                        <AddToCart productID={String(product._id)} img={first} name={product.name} price={product.price} variants={product.variants} />
                    </div>

                    {product.longDescription && (
                        <div className="mt-8 border-t-2 border-dotted border-line pt-6">
                            <h2 className="mb-2 text-lg font-semibold text-[var(--head)]">About this item</h2>
                            <p className="m-0 max-w-prose leading-[1.8] text-muted">{product.longDescription}</p>
                        </div>
                    )}
                </div>
            </div>

            <ProductComments productID={String(product._id)} comments={comments} nextCursor={nextCursor} limit={limit} />
        </div>
    )
}
