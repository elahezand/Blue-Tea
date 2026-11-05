import WishlistModal from '@/model/wishList';
import ProductModel from '@/model/product';
import { getMe } from '@/utils/auth';
import { paginate } from '@/utils/helper';
import WishList from '@/components/template/wishList/wishList';
import { redirect } from 'next/navigation';
import EmptyState from '@/components/modules/emptyState';
import { MdFavoriteBorder } from 'react-icons/md';
import { PageHeader } from '@/components/modules/motion';

const Head = () => <PageHeader crumbs={["Favorites"]} script="Your little list" title="Favorites" intro="Everything you saved from the store." />

export const metadata = {
  title: "Favorites List - Blue Tea",
  description: "View your favorite products on Blue Tea. Keep track of all items you love and save them for later.",
  keywords: ["Blue Tea", "Favorites", "Wishlist", "Saved Products", "Shopping"],
  authors: [{ name: "Blue Tea Team" }],
  openGraph: {
    title: "Favorites List - Blue Tea",
    description: "View your favorite products on Blue Tea. Keep track of all items you love and save them for later.",
    url: "https://yourwebsite.com/favorites",
    siteName: "Blue Tea",
    images: [
      {
        url: "https://yourwebsite.com/images/favorites-og.jpg",
        width: 1200,
        height: 630,
        alt: "Favorites List",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Favorites List - Blue Tea",
    description: "View your favorite products on Blue Tea. Keep track of all items you love and save them for later.",
    images: ["https://yourwebsite.com/images/favorites-og.jpg"],
  },
};

export default async function page({ searchParams }) {
     const user = await getMe()
    if (!user) redirect("/login-register")

    const searchparams = searchParams

    const wishlist = await WishlistModal.findOne({ user: user.id })
    const empty = (
      <div className="pb-16">
        <Head />
        <EmptyState icon={<MdFavoriteBorder />} title="No favorites yet" text="Tap the heart on any product to save it here." href="/products" action="Browse the store" />
      </div>
    )
    if (!wishlist) return empty

    const paginatedData = await paginate(
        ProductModel,
        searchparams,
        { _id: { $in: wishlist.products } }
    )


  return (
    <>
      {user && paginatedData.data.length > 0 ?
        <div className="pb-16">
          <Head />
          <div className="container mt-8">
            <WishList
              nextCursor={paginatedData.nextCursor}
              limit={paginatedData.limit}
              data={JSON.parse(JSON.stringify(paginatedData.data))} />
          </div>

        </div>
        :
        empty
      }
    </>
  )
}
