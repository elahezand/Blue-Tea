import CategoryModel from "@/model/category";
import ProductModal from "@/model/product";
import connectToDB from "@/db/db";
import { paginate } from "@/utils/helper";
import ProductsList from "@/components/template/products/productsList";
export async function generateMetadata({ searchParams }) {
    const categoryName = await searchParams.category || "Products";
    await connectToDB();
    const category = categoryName ? await CategoryModel.findOne({ name: categoryName }) : null;

    return {
        title: categoryName ? `${categoryName} Products | Blue Tea` : "All Products | Blue Tea",
        description: categoryName
            ? `Explore our ${categoryName} products that have a positive effect on the body. High-quality, natural items for your healthy lifestyle.`
            : "Browse our full collection of products. High-quality, natural items for your healthy lifestyle.",
        openGraph: {
            title: categoryName ? `${categoryName} Products | Blue Tea` : "All Products | Blue Tea",
            description: categoryName
                ? `Explore our ${categoryName} products that have a positive effect on the body.`
                : "Browse our full collection of products.",
            url: `https://www.yourdomain.com/products?category=${categoryName || ""}`,
            siteName: "Blue Tea",
            images: category?.img ? [{ url: category.img, width: 800, height: 600 }] : [],
            locale: "en_US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: categoryName ? `${categoryName} Products | Blue Tea` : "All Products | Blue Tea",
            description: categoryName
                ? `Explore our ${categoryName} products that have a positive effect on the body.`
                : "Browse our full collection of products.",
            images: category?.img ? [category.img] : [],
        },
    };
}

export default async function page({ searchParams }) {
    await connectToDB();
    const params = await searchParams;
    const categoryName = await params.category;

    let categoryId;
    if (categoryName) {
        const category = await CategoryModel.findOne({ name: categoryName });
        category ? (categoryId = category._id) : null;
    }

    const paginatedData = await paginate(
        ProductModal,
        params,
        categoryId ? { category: categoryId } : null,
        null,
        true,
        false
    );

    return (
        <div className="py-3">
            <h3 className='header'>
                {categoryName} <span>positive effect on the body</span>
            </h3>
            <div className="container-fluid">
                <div className="row">
                    {/* Sticky Filter Sidebar */}
                    <div className="col-md-3">
                        <div
                            className="position-sticky top-0 vh-100 overflow-auto p-3 text-white border-end"
                            style={{ zIndex: 10 }}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="h5 m-0">Filters</h4>
                                <div className="d-flex gap-2">
                                    <button type="button" className="classic">
                                        Reset
                                    </button>
                                    <button type="button" className="classic">
                                        Apply
                                    </button>
                                </div>
                            </div>

                            {/* Name Search */}
                            <div className="mb-5">
                                <label htmlFor="nameSearch" className="form-label small fw-medium">
                                    Search by name
                                </label>
                                <input
                                    type="text"
                                    id="nameSearch"
                                    placeholder="Enter name..."
                                    className="form-control form-control-sm"
                                />
                            </div>

                            {/* SKU Search */}
                            <div className="mb-5">
                                <label htmlFor="skuSearch" className="form-label small fw-medium">
                                    Search by SKU (Product Code)
                                </label>
                                <input
                                    type="text"
                                    id="skuSearch"
                                    placeholder="Enter SKU..."
                                    className="form-control form-control-sm"
                                />
                            </div>

                            {/* Category Filter */}
                            <div className="mb-5">
                                <label className="form-label fs-5 fw-bold">Category</label>
                                <div className="d-flex flex-wrap gap-2">
                                    {["Coffee", "Herbal Teas", "Organic Snacks"].map((item) => (
                                        <div key={item} className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`category-${item}`}
                                            />
                                            <label
                                                className="form-check-label text-lowercase"
                                                htmlFor={`category-${item}`}>
                                                {item}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div className="mb-5">
                                <label className="form-label small fw-medium">Price (EUR)</label>
                                <div className="d-flex gap-2 mb-2">
                                    <input type="number" className="form-control form-control-sm" placeholder="Min" />
                                    <span className="align-self-center">-</span>
                                    <input type="number" className="form-control form-control-sm" placeholder="Max" />
                                </div>
                                <input type="range" className="form-range" />
                            </div>
                        </div>
                    </div>

                    {/* Products List */}
                    <ProductsList
                        nextCursor={paginatedData.nextCursor}
                        limit={paginatedData.limit}
                        categoryName={categoryName}
                        data={JSON.parse(JSON.stringify(paginatedData.data))} />
                </div>
            </div>
        </div>
    );
}
