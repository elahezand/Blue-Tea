import { Suspense } from "react"
import OrdersList from "@/components/template/p-admin/orders/ordersList"

export default function page() {
    return (
        <Suspense>
            <OrdersList />
        </Suspense>
    )
}
