import connectToDB from '@/configs/db';
import { getMe } from '@/utils/auth';
import { handleTree } from '@/utils/tree';
import WishlistModal from '@/model/wishList';
import Logo from '@/components/modules/logo';
import Link from 'next/link';
import NavMenu from './navMenu';
import StickyHeader from './stickyHeader';

export default async function Navbar() {
    await connectToDB()
    const user = await getMe()
    const tree = await handleTree()
    const categories = JSON.parse(JSON.stringify(tree?.[0]?.children || []))
    const wishlist = user ? await WishlistModal.findOne({ user: user.id }) : null
    const favoritesCount = wishlist?.products?.length || 0

    return (
        <StickyHeader>
            <Link href="/" className="shrink-0 text-[var(--cream)]" aria-label="Blue Tea, home">
                <Logo size={32} light />
            </Link>
            <NavMenu
                categories={categories}
                favoritesCount={favoritesCount}
                user={user ? { name: user.name } : null} />
        </StickyHeader>
    )
}
