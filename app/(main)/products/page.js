import CategoryModel from "@/model/category";
import ProductModal from "@/model/product";
import connectToDB from "@/configs/db";
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
            {/* Products List */}
            <ProductsList
                nextCursor={paginatedData.nextCursor}
                limit={paginatedData.limit}
                categoryName={categoryName}
                params={params}
                data={JSON.parse(JSON.stringify(paginatedData.data))} />
        </div>

    );
}
