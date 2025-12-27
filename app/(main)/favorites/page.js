import WishlistModal from '@/model/wishList';
import { getMe } from '@/utils/auth';
import Product from '@/components/modules/product/product';
import { redirect } from 'next/navigation';
import Pagination from '@/components/modules/pagination/pagination';

export const metadata = {
  title: "Favorites List - Tea Shop",
  description: "View your favorite products on Tea Shop. Keep track of all items you love and save them for later.",
  keywords: ["Tea Shop", "Favorites", "Wishlist", "Saved Products", "Shopping"],
  authors: [{ name: "Tea Shop Team" }],
  openGraph: {
    title: "Favorites List - Tea Shop",
    description: "View your favorite products on Tea Shop. Keep track of all items you love and save them for later.",
    url: "https://yourwebsite.com/favorites",
    siteName: "Tea Shop",
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
    title: "Favorites List - Tea Shop",
    description: "View your favorite products on Tea Shop. Keep track of all items you love and save them for later.",
    images: ["https://yourwebsite.com/images/favorites-og.jpg"],
  },
};

export default async function page({ searchParams }) {
  const user = await getMe()
  let wishlist = null
  let totalCount = null

  if (!user) return redirect("login-register")

  const page = await searchParams.page || 1
  const limit = await searchParams.limit || 15

  let cursor = null
  if (page > 1) {
    const prevFavorites = await WishlistModal
      .find({ user: user._id })
      .sort({ _id: 1 })
      .limit(((page - 1) * limit))
      .select("_id")
      .lean();
    cursor = prevFavorites[prevFavorites.length - 1]?._id;

  }

  const query = cursor ? { _id: { $gt: cursor } } : {};
  totalCount = await WishlistModal.countDocuments();

  wishlist = await WishlistModal
    .find({ ...query, user: user._id })
    .sort({ _id: 1 })
    .limit(limit)
    .populate("user")
    .populate("products")
    .lean();

  return (
    <>
      {user && wishlist.length > 0 ?
        <div className='py-5'>
          <div className='header'>
            <h1>Favorites List</h1>
          </div>
          <div className='container'>
            <div className='row gap-1'>
              {
                JSON.parse(JSON.stringify(wishlist)).map((w, index) => (
                  w.products.map((item, index) => (
                    <Product
                      key={index + 1}
                      id={item._id}
                      name={item.name}
                      img={item.img}
                      shortDescription={item.shortDescription}
                      score={item.score}
                      price={item.price}
                    />

                  ))
                ))
              }
            </div>
            <Pagination
              href="favorites?"
              currentPage={page}
              pageCount={Math.ceil(totalCount / limit)}
              limit={limit}
            />
          </div>

        </div>
        :
        <span>NOT FOUND</span>
      }
    </>
  )
}
