import { getMe } from '@/services/auth.server';
import { getProductCategoryTree } from '@/services/category.service';
import Logo from '@/components/modules/logo';
import Link from 'next/link';
import NavMenu from './navMenu';
import StickyHeader from './stickyHeader';

export default async function Navbar() {
    const [user, tree] = await Promise.all([getMe(), getProductCategoryTree()])
    const categories = tree?.[0]?.children || []
    // TODO: number of saved products (wishlist request removed for now)
    const favoritesCount = 0

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
