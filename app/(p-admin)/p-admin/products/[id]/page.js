import ProductModal from "@/model/product";
import EditProduct from "@/components/template/p-admin/products/editProduct";
import { handleTree } from "@/utils/tree";
export default async function page({ params }) {
    const { id } = await params
    const product = await ProductModal.findOne({ _id: id }).lean()
    const tree = await handleTree()

    return (
        <div>
            <h4 className="fw-bold text-white mb-3">
                Edit Product
            </h4>
            <div className="transparentCard">
                <EditProduct
                    data={JSON.parse(JSON.stringify(product))}
                    tree={tree}
                />
            </div>
        </div>
    );
}
