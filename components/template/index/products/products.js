import { SectionHeader } from "@/components/modules/motion";
import ShopShelf from "./shopShelf";

/* Shop section: category tabs, then an even grid of favourites. */
export default function Products({ products = [], categories = [] }) {
    if (!products.length) return null
    return (
        <section className="!py-14 lg:!py-20">
            <div className="container">
                <SectionHeader script="Take a little home" title="From the shop" />
                <ShopShelf products={products} categories={categories} />
            </div>
        </section>
    );
}
