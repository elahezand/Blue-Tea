import React from 'react'
import CartItems from '@/components/template/cart/cartItems'
import { getMe } from '@/services/auth.server'
import { PageHeader } from '@/components/modules/motion'

export const metadata = {
  title: "Shopping Cart - YourSiteName",
  description: "View and manage the items in your shopping cart. Proceed to checkout or continue shopping.",
  keywords: "shopping cart, checkout, products, ecommerce, your site name",
  openGraph: {
    title: "Shopping Cart - YourSiteName",
    description: "View and manage the items in your shopping cart. Proceed to checkout or continue shopping.",
    url: "https://yoursite.com/cart",
    siteName: "YourSiteName",
    images: [
      {
        url: "https://yoursite.com/images/cart-og-image.png",
        width: 800,
        height: 600,
        alt: "Shopping Cart",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shopping Cart - YourSiteName",
    description: "View and manage the items in your shopping cart. Proceed to checkout or continue shopping.",
    images: ["https://yoursite.com/images/cart-og-image.png"],
  },
};

export default async function page() {
  const user = await getMe()

  return (
    <div className="pb-16">
      <PageHeader crumbs={["Cart"]} script="Almost yours" title="Your cart" intro="Check your order, then add your delivery details." />
      <div className="h-8" />
      <CartItems
        userId={user?._id} />
    </div>
  )
}
