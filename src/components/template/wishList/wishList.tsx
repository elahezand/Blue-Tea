"use client"
import { MdClose, MdFavoriteBorder } from "react-icons/md"
import Loader, { Spinner } from "@/components/feedBack/Loader"
import EmptyState from "@/components/modules/emptyState"
import Product from "@/components/modules/product/product"
import { useGetMyWishlist, useRemoveFromWishlist } from "@/services/wishlist.service"

export default function WishList() {
    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetMyWishlist()
    const { mutate: removeItem, isPending: removing, variables: removingId } = useRemoveFromWishlist()
    const favorites = data?.items ?? []

    if (isLoading) return <Loader inline label="Loading your favorites" />

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
                {favorites.map((item) => {
                    const busy = removing && removingId === item._id
                    return (
                        <div key={item._id} className={`relative transition-opacity ${busy ? "opacity-50" : ""}`}>
                            <Product id={item._id} name={item.name} img={item.img}
                                shortDescription={item.shortDescription} score={item.score} price={item.price} />
                            <button type="button" onClick={() => removeItem(item._id)} disabled={busy}
                                aria-label={`Remove ${item.name} from favorites`}
                                className="absolute end-4 top-4 flex size-8 cursor-pointer items-center justify-center rounded-full border-none bg-surface/90 text-lg text-fg shadow-sm transition-colors hover:text-berry disabled:cursor-wait">
                                <MdClose />
                            </button>
                        </div>
                    )
                })}
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