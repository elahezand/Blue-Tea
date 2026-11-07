import type { RouteProps } from "@/types/api"
import { getProductById } from "@/services/product.service";
import { getProductCategoryTree } from "@/services/category.service";
import EditProduct from "@/components/template/p-admin/products/editProduct";
export default async function page({ params }: Pick<RouteProps<{ id: string }>, "params">) {
    const { id } = await params
    const [product, tree] = await Promise.all([
        getProductById(id),
        getProductCategoryTree(),
    ])

    return (
        <div>
            <h4 className="font-bold text-fg mb-4">
                Edit Product
            </h4>
            <div className="transparentCard">
                <EditProduct
                    data={product}
                    tree={tree}
                />
            </div>
        </div>
    );
}
