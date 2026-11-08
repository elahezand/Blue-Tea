import type { Metadata } from "next"
import CartItems from "@/components/template/cart/cartItems"
import { PageHeader } from "@/components/modules/motion"


export const metadata: Metadata = {
  title: "Your cart",
  description: "Check the teas and teaware in your cart, then add your delivery details.",
  robots: { index: false, follow: false },
}

export default function page() {
  return (
    <div className="pb-16">
      <PageHeader crumbs={["Cart"]} script="Almost yours" title="Your cart" intro="Check your order, then add your delivery details." />
      <div className="h-8" />
      <CartItems />
    </div>
  )
}