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
                        onChange={(e) => setSearchValue(e.target.value)}
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
                            value={item}
                            onChange={(e) => setCategory(e.target.value)}
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
                            onChange={(e) => setMin(e.target.value)}
                            placeholder="Min" />
                        <span className="align-self-center">-</span>
                        <input type="number"
                            onChange={(e) => setMax(e.target.value)}
                            className="form-control form-control-sm"
                            placeholder="Max" />
                    </div>
                    <input type="range" className="form-range" />
                </div>
            </div>
        </div>
    )
}
