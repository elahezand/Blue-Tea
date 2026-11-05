import React, { useState } from 'react'
import axios from 'axios'
export default function FilterProduct({ categoryName, setProducts }) {
    const [searchValue, setSearchValue] = useState("")
    const [min, setMin] = useState("")
    const [max, setMax] = useState("")

    const sortHandeler = async () => {
        const params = {
            category: categoryName || null,
            value: searchValue || null,
            min: min || null,
            max: max || null,
        }
        const { data } = await axios.get(
            "/api/products",
            { params },
        );

        setProducts(data.data)

    };

    return (
        <div className="w-full shrink-0 px-3 md:w-1/4">
            <div
                className="sticky py-4 px-6 text-white border-e border-[#dee2e6]"
                style={{ top: "120px", zIndex: 10 }}>
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xl font-medium m-0">Filters</h4>
                    <div className="flex gap-2">
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
                <div className="mb-12">
                    <label htmlFor="nameSearch"
                        className="field-label text-[.875em] font-semibold">
                        Search by name
                    </label>
                    <input
                        type="text"
                        onChange={(e) => setSearchValue(e.target.value)}
                        id="nameSearch"
                        placeholder="Enter name..."
                        className="field field-sm"
                    />
                </div>

                {/* SKU Search */}
                <div className="mb-12">
                    <label htmlFor="skuSearch"
                        className="field-label text-[.875em] font-semibold">
                        Search by SKU (Product Code)
                    </label>
                    <input
                        type="text"
                        id="skuSearch"
                        placeholder="Enter SKU..."
                        className="field field-sm"
                    />
                </div>

                {/* Category Filter */}
                {["Coffee", "Herbal Teas", "Organic Snacks"].map((item) => (
                    <div key={item} className="mb-0.5 block min-h-6 ps-6">
                        <input
                            className="float-left -ms-6 mt-1 size-4 accent-[#0d6efd]"
                            type="radio"
                            name="category"
                            value={item}
                            onChange={(e) => setCategory(e.target.value)}
                            id={`category-${item}`}
                        />
                        <label
                            className="lowercase"
                            htmlFor={`category-${item}`}>
                            {item}
                        </label>
                    </div>
                ))}

                {/* Price Filter */}
                <div className="mb-12">
                    <label className="field-label text-[.875em] font-semibold">Price (EUR)</label>
                    <div className="flex gap-2 mb-2">
                        <input type="number"
                            className="field field-sm"
                            onChange={(e) => setMin(e.target.value)}
                            placeholder="Min" />
                        <span className="self-center">-</span>
                        <input type="number"
                            onChange={(e) => setMax(e.target.value)}
                            className="field field-sm"
                            placeholder="Max" />
                    </div>
                    <input type="range" className="h-6 w-full cursor-pointer accent-[#0d6efd]" />
                </div>
            </div>
        </div>
    )
}
