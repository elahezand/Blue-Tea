import CategoryModel from "@/model/category";
import ProductModal from "@/model/product";
import connectToDB from "@/db/db";
import Product from "@/components/modules/product/product";
import Pagination from "@/components/modules/pagination/pagination";

export async function generateMetadata({ searchParams }) {
    const categoryName = searchParams.category || "Products";
    await connectToDB();
    const category = categoryName ? await CategoryModel.findOne({ name: categoryName }) : null;

    return {
        title: categoryName ? `${categoryName} Products | Tea Shop` : "All Products | Tea Shop",
        description: categoryName
            ? `Explore our ${categoryName} products that have a positive effect on the body. High-quality, natural items for your healthy lifestyle.`
            : "Browse our full collection of products. High-quality, natural items for your healthy lifestyle.",
        openGraph: {
            title: categoryName ? `${categoryName} Products | Tea Shop` : "All Products | Tea Shop",
            description: categoryName
                ? `Explore our ${categoryName} products that have a positive effect on the body.`
                : "Browse our full collection of products.",
            url: `https://www.yourdomain.com/products?category=${categoryName || ""}`,
            siteName: "Tea Shop",
            images: category?.img ? [{ url: category.img, width: 800, height: 600 }] : [],
            locale: "en_US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: categoryName ? `${categoryName} Products | Tea Shop` : "All Products | Tea Shop",
            description: categoryName
                ? `Explore our ${categoryName} products that have a positive effect on the body.`
                : "Browse our full collection of products.",
            images: category?.img ? [category.img] : [],
        },
    };
} export default async function page({ searchParams }) {
    connectToDB()
    const searchparams = await searchParams
    const page = Number(searchparams.page) || 1;
    const limit = Number(searchparams.limit) || 10;
    const categoryName = searchparams.category

    let categoryId;

    if (categoryName) {
        const category = await CategoryModel.findOne({ name: categoryName })
        if (category) categoryId = category._id;
    }

    let cursor = null
    if (page > 1) {
        const prevProducts = await ProductModal
            .find({ category: categoryId })
            .sort({ _id: 1 })
            .limit((page - 1) * limit)
            .select("_id")
            .lean()

        cursor = prevProducts[prevProducts.length - 1]?._id
    }

    const query = cursor
        ? { _id: { $gt: cursor }, category: categoryId }
        : { category: categoryId };

    const totalCount = await ProductModal.countDocuments({ category: categoryId });
    const products = await ProductModal
        .find(query, "-__v")
        .sort({ _id: 1 })
        .limit(limit)
        .lean();

    return (
        <>
            <div className="py-5">
                <div>
                    <h3 className="header">{categoryName}
                        <span> positive effect on the body</span></h3>
                </div>
                <div className="container">
                    <div className="row">
                        {JSON.parse(JSON.stringify(products)).map((item, index) => (
                            <Product
                                key={index + 1}
                                id={item._id}
                                name={item.name}
                                img={item.img}
                                shortDescription={item.shortDescription}
                                score={item.score}
                                price={item.price}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <Pagination
                href={`products?category=${categoryName}&`}
                currentPage={page}
                pageCount={Math.ceil(totalCount / limit)}
                limit={limit}
            />
        </>

    )
}
