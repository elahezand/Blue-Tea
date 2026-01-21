"use client"
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
        <div className='row gap-1'>
            {favorites.map((w) => (
                w.products.map((item) => (
                    <Product key={item._id} {...item} />
                ))
            ))
            }
            {cursor && (
                <div className="mt-5 col-12">
                    <button onClick={loadMore} className="classic w-100"
                        disabled={loading}>
                        {loading ? "Loading..." : "Load more"}
                    </button>
                </div>
            )}
        </div>
    )
}
