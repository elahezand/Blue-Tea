import React from 'react'
import connectToDB from '@/db/db'
import AddNewProduct from '@/components/template/p-admin/products/addNewProduct'
import { handleTree } from '@/utils/tree'
export default async function page() {
    await connectToDB()
    const tree = await handleTree()
    const serializedTree = JSON.parse(JSON.stringify(tree))
    return (
        <>
            <h4 className='fw-bold'
                style={{ color: "var(--brown-light)", marginBottom: "1rem" }}>
                Create New Product
            </h4>
            <div className="transparentCard">
               <AddNewProduct tree={serializedTree || []}/>
            </div>
        </>
    )
}
