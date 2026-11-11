import type { Metadata } from "next"
import WishList from "@/components/template/favorites/wishList"
import { PageHeader } from "@/components/modules/motion"


export const metadata: Metadata = {
  title: "Favorites",
  description: "Everything you saved from the Blue Tea store.",
  robots: { index: false, follow: false },
}

export default function page() {
  return (
    <div className="pb-16">
      <PageHeader crumbs={["Favorites"]} script="Your little list" title="Favorites" intro="Everything you saved from the store." />
      <div className="container mt-8">
        <WishList />
      </div>
    </div>
  )
}