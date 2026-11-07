import type { RouteProps } from "@/types/api"
import { getCategoryByName } from "@/services/category.service";
import { getProducts } from "@/services/product.service";
import { PageHeader } from "@/components/modules/motion";
import ProductsList from "@/components/template/products/productsList";
import { getParam } from "@/utils/helper";

export async function generateMetadata({ searchParams }: Pick<RouteProps, "searchParams">) {
    const sp = await searchParams;
    const categoryName = getParam(sp?.category) || "Products";
    const category = categoryName ? await getCategoryByName(categoryName) : null;

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

export default async function page({ searchParams }: Pick<RouteProps, "searchParams">) {
    const params = await searchParams;
    const categoryName = getParam(params.category);
    const paginatedData = await getProducts(params);
    
    return (
        <>
            <PageHeader
                crumbs={categoryName ? ["Store", categoryName] : ["Store"]}
                title={categoryName || "The store"}
                intro="Loose-leaf teas, coffee and small pantry things, picked by the people who brew them." />
            {/* Products List */}
            <ProductsList
                nextCursor={paginatedData.nextCursor}
                limit={paginatedData.limit}
                categoryName={categoryName}
                params={params}
                data={paginatedData.data} />
        </>

    );
}
