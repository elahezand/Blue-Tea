import React from 'react'
import AddNewProduct from '@/components/template/p-admin/products/addNewProduct'
import { getProductCategoryTree } from '@/services/category.service'
export default async function page() {
    const tree = await getProductCategoryTree()
    return (
        <>
            <h4 className="font-bold text-fg mb-4">
                Create New Product
            </h4>
                <AddNewProduct tree={tree || []} />
        </>
    )
}
