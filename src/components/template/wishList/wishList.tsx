"use client"
import { Spinner } from "@/components/feedBack/Loader"
import { useState } from 'react'
import Product from '@/components/modules/product/product'
import type { Product as ProductModel } from '@/types/models'

interface WishListProps {
    data: ProductModel[]
    limit?: number
    nextCursor?: string | null
}

export default function WishList({ data: initialData, limit, nextCursor = null }: WishListProps) {
    const [favorites] = useState<ProductModel[]>(initialData);
    const [cursor] = useState<string | null>(nextCursor);
    const [loading] = useState(false);

    const loadMore = () => {
        if (!cursor || loading) return;
        // TODO: load-more request (removed for now): GET /wishlist?cursor&limit -> append data, set nextCursor
        void limit
    };

    return (
        <div className="-mx-3 flex flex-wrap gap-1">
            {favorites.map((item) => (
                <Product key={item._id} id={item._id} name={item.name} img={item.img}
                    shortDescription={item.shortDescription} score={item.score} price={item.price} />
            ))}
            {cursor && (
                <div className="mt-12 w-full px-3">
                    <button onClick={loadMore} className="classic w-full"
                        disabled={loading}>
                        {loading ? <Spinner label="Loading" /> : "Load more"}
                    </button>
                </div>
            )}
        </div>
    )
}
