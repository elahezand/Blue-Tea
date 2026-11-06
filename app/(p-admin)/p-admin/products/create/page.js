import React from 'react'
import connectToDB from '@/configs/db'
import AddNewProduct from '@/components/template/p-admin/products/addNewProduct'
import { handleTree } from '@/utils/tree'
export default async function page() {
    await connectToDB()
    const tree = await handleTree()
    const serializedTree = JSON.parse(JSON.stringify(tree))
    return (
        <>
            <h4 className="font-bold text-fg mb-4">
                Create New Product
            </h4>
                <AddNewProduct tree={serializedTree || []} />
        </>
    )
}
