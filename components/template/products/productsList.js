"use client"
import { useState } from "react";
import Product from "@/components/modules/product/product";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import qs from "qs";
export default function ProductsList({ data: initialData, categoryName, limit, nextCursor }) {
    const [products, setProducts] = useState(initialData);
    const [loading, setLoading] = useState(false);

    let queryString = null

    const [params, setParams] = useState({
        category: categoryName,
        min: "",
        max: "",
        value: "",
        cursor: nextCursor,
        limit
    })

    queryString = qs.stringify(params,
        { encode: false, });

    const queryKey = [`/api/products-${queryString}`]

    const { refetch } = useQuery({
        queryKey,
        queryFn: async () => {
            const { data } = await axios.get(`/api/products?${queryString}`);
            return data;
        },
    });

    const loadMore = async () => {
        setLoading(true);
        const res = await refetch();

        setProducts(prev => [...prev, ...res.data.data]);
        setParams(prev => prev = { ...prev, cursor: res.data.nextCursor })
        setLoading(false);
    };

    const sortHandeler = async () => {
        queryString = qs.stringify(params,
            { encode: false, })

        const res = await refetch();
        setProducts(res.data.data);
        setParams(prev => prev = { ...prev, cursor: res.data.nextCursor })
    }

    return (
        <div className="container-fluid py-5">
            <div className="row justify-content-between">
                <div className="col-md-3">
                    <div
                        className="position-sticky py-3 px-4 text-white border-end"
                        style={{ top: "120px", zIndex: 10 }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="h5 m-0">Filters</h4>
                            <div className="d-flex gap-2">
                                <button type="button"
                                    className="classic">
                                    Reset
                                </button>
                                <button type="button"
                                    onClick={() => sortHandeler()}
                                    className="classic">
                                    Apply
                                </button>
                            </div>
                        </div>

                        {/* Name Search */}
                        <div className="mb-5">
                            <label htmlFor="nameSearch"
                                className="form-label small fw-medium">
                                Search by name
                            </label>
                            <input
                                type="text"
                                onChange={(e) => setParams(prev => prev = { ...prev, value: e.target.value })
                                }
                                id="nameSearch"
                                placeholder="Enter name..."
                                className="form-control form-control-sm"
                            />
                        </div>

                        {/* SKU Search */}
                        <div className="mb-5">
                            <label htmlFor="skuSearch"
                                className="form-label small fw-medium">
                                Search by SKU (Product Code)
                            </label>
                            <input
                                type="text"
                                id="skuSearch"
                                placeholder="Enter SKU..."
                                className="form-control form-control-sm"
                            />
                        </div>

                        {/* Category Filter */}
                        {["Coffee", "Herbal Teas", "Organic Snacks"].map((item) => (
                            <div key={item} className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="category"
                                    onChange={() => setParams(prev => prev = { ...prev, category: item })}
                                    id={`category-${item}`}
                                />
                                <label
                                    className="form-check-label text-lowercase"
                                    htmlFor={`category-${item}`}>
                                    {item}
                                </label>
                            </div>
                        ))}

                        {/* Price Filter */}
                        <div className="mb-5">
                            <label className="form-label small fw-medium">Price (EUR)</label>
                            <div className="d-flex gap-2 mb-2">
                                <input type="number"
                                    className="form-control form-control-sm"
                                    onChange={(e) => setParams(prev => prev = { ...prev, min: e.target.value })}
                                    placeholder="Min" />
                                <span className="align-self-center">-</span>
                                <input type="number"
                                    onChange={(e) => setParams(prev => prev = { ...prev, max: e.target.value })}
                                    className="form-control form-control-sm"
                                    placeholder="Max" />
                            </div>
                            <input type="range" className="form-range" />
                        </div>
                    </div>
                </div>
                <div className="col-md-9">
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3 justify-content-center">
                        {products.map((item, index) => (
                            <Product key={index + 1} {...item} />
                        ))}
                    </div>
                    {params.cursor && (
                        <div className="mt-5 col-12">
                            <button onClick={loadMore}
                                className="classic w-100"
                                disabled={loading}>
                                {loading ? "Loading..." : "Load more"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


