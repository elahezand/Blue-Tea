"use client"
import { Spinner } from "@/components/feedBack/Loader"
import React, { useState } from 'react'
import { useGet } from '@/utils/hooks/useReactQueryPublic';
import Product from '@/components/modules/product/product'


export default function WishList({ data: initialData, limit, nextCursor }) {
    const [favorites, setFavorites] = useState(initialData);
    const [cursor, setCursor] = useState(nextCursor);
    const [loading, setLoading] = useState(false);

    const { refetch } = useGet(
        "/wishlist",
        { cursor, limit },
        { enabled: false }
    );

    const loadMore = async () => {
        if (!cursor || loading) return;

        setLoading(true);
        const res = await refetch();

        setFavorites(prev => [...prev, ...res.data.data]);
        setCursor(res.data.nextCursor);
        setLoading(false);
    };

    return (
        <div className="-mx-3 flex flex-wrap gap-1">
            {favorites.map((w) => (
                w.products.map((item) => (
                    <Product key={item._id} {...item} />
                ))
            ))
            }
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
