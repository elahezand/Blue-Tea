"use client"
import { MdFavoriteBorder } from "react-icons/md"
import Loader, { Spinner } from "@/components/feedback/loader"
import EmptyState from "@/components/modules/emptyState"
import Product from "@/components/modules/product/product"
import { useAuth } from "@/hooks/useAuth"
import { useGetMyWishlist } from "@/services/wishlist.service"
import { ROUTES } from "@/utils/constant"

export default function WishList() {
    const { isLoggedIn } = useAuth()
    const { data, isLoading, isLoadingError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetMyWishlist(isLoggedIn)
    const favorites = data?.items ?? []

    if (!isLoggedIn) return (
        <EmptyState icon={<MdFavoriteBorder />} title="Sign in to see your favorites"
            text="Your saved products are linked to your account."
            href={`${ROUTES.LOGIN}?next=%2Ffavorites`} action="Sign in" />
    )

    if (isLoading) return <Loader inline label="Loading your favorites" />

    if (isLoadingError) return (
        <div className="mx-auto max-w-sm rounded-2xl bg-soft p-6 text-center" role="alert">
            <p className="mb-4">Couldn&apos;t load your favorites.</p>
            <button type="button" onClick={() => void refetch()} className="btn btn-outline">Try again</button>
        </div>
    )

    if (!favorites.length) {
        return (
            <EmptyState icon={<MdFavoriteBorder />} title="No favorites yet"
                text="Tap the heart on any product to save it here."
                href="/products" action="Browse the store" />
        )
    }

    return (
        <>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {favorites.map((item) => (
                    <Product key={item._id} id={item._id} name={item.name} img={item.img}
                        shortDescription={item.shortDescription} score={item.score} price={item.price} variants={item.variants} saved />
                ))}
            </div>

            {hasNextPage && (
                <div className="mt-12">
                    <button type="button" onClick={() => fetchNextPage()} className="classic w-full" disabled={isFetchingNextPage}>
                        {isFetchingNextPage ? <Spinner label="Loading" /> : "Load more"}
                    </button>
                </div>
            )}
        </>
    )
}
