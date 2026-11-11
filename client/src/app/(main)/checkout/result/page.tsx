import { Suspense } from "react"
import type { Metadata } from "next"
import { PageHeader } from "@/components/modules/motion"
import PaymentResult from "@/components/template/checkout/paymentResult"

export const metadata: Metadata = {
    title: "Your order",
    robots: { index: false, follow: false },
}

export default function page() {
    return (
        <div className="pb-16">
            <PageHeader crumbs={["Cart", "Order"]} script="Almost there" title="Your order" />
            <div className="container mt-8 max-w-3xl">
                <Suspense>
                    <PaymentResult />
                </Suspense>
            </div>
        </div>
    )
}
