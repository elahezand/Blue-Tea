"use client"
import { useState,useEffect } from "react";
import Product from "@/components/modules/product/product";
import { useGet } from "@/utils/hooks/useReactQueryPublic";

export default function ProductsList({ data: initialData, categoryName, limit, nextCursor }) {
    const [products, setProducts] = useState(initialData);
    const [cursor, setCursor] = useState(nextCursor);
    const [loading, setLoading] = useState(false);

    const { refetch } = useGet(
        "/products",
        { category: categoryName, cursor, limit },
        { enabled: false }
    );

    const loadMore = async () => {
        if (!cursor || loading) return;

        setLoading(true);
        const res = await refetch();

        setProducts(prev => [...prev, ...res.data.data]);
        setCursor(res.data.nextCursor);
        setLoading(false);
    };


    useEffect(() => {
        setProducts(initialData);
        setCursor(nextCursor);
    }, [categoryName, initialData, nextCursor]);

    return (
        <div className="col-md-9">
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3 justify-content-center">
                {products.map(item => (
                    <Product key={item._id} {...item} />
                ))}
            </div>

            {cursor && (
                <div className="mt-5 col-12">
                    <button onClick={loadMore} className="classic w-100"
                        disabled={loading}>
                        {loading ? "Loading..." : "Load more"}
                    </button>
                </div>
            )}
        </div>
    );
}
