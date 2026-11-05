import React from 'react'

export default function MenuItem({ products, catId }) {
    return (
        <>
            {products.filter(item => item.category._id.toString() === catId.toString()).map((pro, index) => (
                <div
                    key={index + 1}
                    className="py-3">
                    <div className="flex items-baseline gap-3">
                        <h6 className="m-0 font-body font-medium text-fg">{pro.name}</h6>
                        <span className="flex-1 -translate-y-1 border-b border-dotted border-line"></span>
                        <strong className="font-medium text-link">$ {pro.price}</strong>
                    </div>
                    <small className="text-muted">{pro.description}</small>
                </div>
            ))}
        </>
    )
}
