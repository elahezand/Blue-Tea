import { getProductCategories } from '@/services/category.service';
import Logo from '@/components/modules/logo';
import Link from 'next/link';
import NavMenu from './navMenu';
import StickyHeader from './stickyHeader';

export default async function Navbar() {
    const tree = await getProductCategories().catch(() => [])
    const categories = tree.length === 1 ? tree[0].children ?? [] : tree

    return (
        <StickyHeader>
            <Link href="/" className="shrink-0 text-[var(--cream)]" aria-label="Blue Tea, home">
                <Logo size={32} light />
            </Link>
            <NavMenu categories={categories} />
        </StickyHeader>
    )
}