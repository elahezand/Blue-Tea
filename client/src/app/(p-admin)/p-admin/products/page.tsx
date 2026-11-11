import { Suspense } from "react"
import ProductList from "@/components/template/p-admin/products/productList"

export default function page() {
    return (
        <Suspense>
            <ProductList />
        </Suspense>
    )
}
