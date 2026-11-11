import type { RouteProps } from "@/types/api"
import EditProduct from "@/components/template/p-admin/products/editProduct";

export default async function page({ params }: Pick<RouteProps<{ id: string }>, "params">) {
    const { id } = await params

    return (
        <div>
            <h4 className="font-bold text-fg mb-4">
                Edit Product
            </h4>
            <div className="transparentCard">
                <EditProduct id={id} />
            </div>
        </div>
    );
}