import React from 'react'
import CategoryModel from '@/model/category'
import connectToDB from '@/db/db'
import AddnewMenuItem from '@/components/template/p-admin/menu/addnewMenuItem'
export default async function page() {
    connectToDB()
    const categories = await CategoryModel.find({}).lean()
    const tree = []

    const buildChildren = (parent) => {
        const children = [...categories].filter(cat => cat.parentId?.toString() === parent._id.toString())
            .map(cat => ({ ...cat, children: buildChildren(cat) }));

        return children
    }
    categories.filter(parent => {
        if (!parent.parentId) {
            tree.push({ ...parent, children: buildChildren(parent._id) })
        }
    })
    return (
        <>
            <h4 className='fw-bold text-white mb-3'>
                Create New MenuItem
            </h4>
            <AddnewMenuItem tree={JSON.parse(JSON.stringify(tree))} />
        </>

    )
}
