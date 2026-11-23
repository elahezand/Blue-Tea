import { SectionHeader } from "@/components/modules/motion";
import ShopShelf from "./shopShelf";
import type { CursorPaginated } from "@/types/api";
import type { ProductCategoryNode } from "@/types/category"
import type { Product } from "@/types/product"

interface ProductsProps {
    initialPage?: CursorPaginated<Product> | null
    categories?: Pick<ProductCategoryNode, "_id" | "name" | "slug">[]
}

export default function Products({ initialPage, categories = [] }: ProductsProps) {
    if (!initialPage?.data.length) return null
    return (
        <section className="!pt-10 lg:!pt-16">
            <div className="container">
                <SectionHeader script="Take a little home" title="From the shop" />
                <ShopShelf initialPage={initialPage} categories={categories} />
            </div>
        </section>
    );
}
