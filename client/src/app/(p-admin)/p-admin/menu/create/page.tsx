import AddnewMenuItem from '@/components/template/p-admin/menu/addnewMenuItem'
import type { CategoryNode } from '@/types/models'

export default async function page() {
    // TODO: category tree request (removed for now): the tree comes ready from the backend
    const tree: CategoryNode[] = []
    return (
        <>
            <h4 className="font-bold text-fg mb-4">
                Create New MenuItem
            </h4>
            <AddnewMenuItem tree={tree} />
        </>

    )
}
