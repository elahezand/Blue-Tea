import WishlistModal from '@/model/wishList';
import { getMe } from '@/utils/auth';
import { paginate } from '@/utils/helper';
import WishList from '@/components/template/wishList/wishList';
import { redirect } from 'next/navigation';

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
  if (!user) return redirect("/login-register")

  const searchparams = await searchParams
  const paginatedData = await paginate(WishlistModal, searchparams, {user:user.id}, "products", true, false)

  return (
    <>
      {user && paginatedData.data.length > 0 ?
        <div className='py-5'>
          <div className='header'>
            <h1>Favorites List</h1>
          </div>
          <div className='container-fluid'>
            <WishList
              nextCursor={paginatedData.nextCursor}
              limit={paginatedData.limit}
              data={JSON.parse(JSON.stringify(paginatedData.data))} />
          </div>

        </div>
        :
        <span>NOT FOUND</span>
      }
    </>
  )
}
