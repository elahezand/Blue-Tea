import { SectionHeader } from "@/components/modules/motion";
import ShopShelf from "./shopShelf";
import type { CursorPaginated } from "@/types/api";
import type { ProductCategoryNode, Product } from "@/types/models";

interface ProductsProps {
    initialPage?: CursorPaginated<Product> | null
    categories?: Pick<ProductCategoryNode, "_id" | "name">[]
}

export default function Products({ initialPage, categories = [] }: ProductsProps) {
    if (!initialPage?.data.length) return null
    return (
        <section className="!py-14 lg:!py-20">
            <div className="container">
                <SectionHeader script="Take a little home" title="From the shop" />
                <ShopShelf initialPage={initialPage} categories={categories} />
            </div>
        </section>
    );
}