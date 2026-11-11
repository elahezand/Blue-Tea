import { Suspense } from 'react'
import TableToolbar from '@/components/modules/p-admin/TableToolbar'
import { productFilters } from '@/components/modules/p-admin/tableFilters'
import Table from '@/components/modules/table/Table'
import ProductList from '@/components/template/p-admin/products/productList'
export default function page() {
    return (
        <Suspense>
            <Table title={"All Products"} toolbar={<TableToolbar fields={productFilters()} />}>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Rating</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <ProductList />
            </Table>
        </Suspense>
    )
}