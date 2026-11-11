import { Suspense } from "react";
import type { Metadata } from "next";
import type { RouteProps } from "@/types/api"
import { getCategories } from "@/services/category.service";
import { getProducts } from "@/services/product.service";
import { PageHeader } from "@/components/modules/motion";
import ProductsList from "@/components/template/products/productsList";
import { getParam } from "@/utils/helper";
import type { ProductCategoryNode } from "@/types/models";

const INTRO = "Loose-leaf teas, coffee and small pantry things, picked by the people who brew them."

const readCategory = async (searchParams: RouteProps["searchParams"]): Promise<string> => {
    const name = getParam((await searchParams)?.category)?.trim()
    const names = (nodes: ProductCategoryNode[]): string[] => nodes.flatMap((n) => [n.name, ...names(n.children ?? [])])
    return name && names(await getCategories()).includes(name) ? name : ""
}

export async function generateMetadata({ searchParams }: Pick<RouteProps, "searchParams">): Promise<Metadata> {
    const sp = await searchParams
    const category = await readCategory(searchParams)
    const filtered = Boolean(getParam(sp?.q) || getParam(sp?.min) || getParam(sp?.max) || getParam(sp?.sort))
    const title = category ? `${category} | Store` : "Store"
    const description = category
        ? `${category} from Blue Tea: loose-leaf teas, coffee and pantry things, picked by the people who brew them.`
        : INTRO

    return {
        title,
        description,
        alternates: { canonical: category ? `/products?category=${encodeURIComponent(category)}` : "/products" },
        robots: filtered ? { index: false, follow: true } : undefined,
        openGraph: { title, description, url: "/products", type: "website" },
        twitter: { card: "summary", title, description },
    };
}

export default async function page({ searchParams }: Pick<RouteProps, "searchParams">) {
    const category = await readCategory(searchParams)
    const [firstPage, categories] = await Promise.all([
        getProducts(category || undefined).catch(() => null), 
        getCategories(),
    ])

    return (
        <>
            <PageHeader
                crumbs={category ? ["Store", category] : ["Store"]}
                title={category || "The store"}
                intro={INTRO} />
            <Suspense>
                <ProductsList initialPage={firstPage} initialCategory={category} categories={categories} />
            </Suspense>
        </>
    );
}