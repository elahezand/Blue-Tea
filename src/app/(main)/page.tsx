import { getTopProducts } from "@/services/product.service";
import { getCategories } from "@/services/category.service";
import { getLatestArticles } from "@/services/article.service";
import { getLatestComments } from "@/services/comment.service";
import Menu from "@/components/template/index/menu/menu";
import About from "@/components/template/index/about/about";

import Banner from "@/components/template/index/banner/banner"
import Barista from "@/components/template/index/barista/barista"
import Reviews from "@/components/template/index/reviews/reviews"
import Reservation from "@/components/template/index/reservation/reservation"
import Articles from "@/components/template/index/articles/articles"
import Contact from "@/components/template/index/contact/contact"
import Products from "@/components/template/index/products/products"
import Offers from "@/components/template/index/offers/offers"


export const generateMetadata = async () => {
    return {
        title: "Blue Tea | Natural & Organic Products",
        description: "Discover the finest selection of organic teas and natural products. Fresh, healthy, and crafted for your wellness.",
        openGraph: {
            title: "Blue Tea | Natural & Organic Products",
            description: "Discover the finest selection of organic teas and natural products. Fresh, healthy, and crafted for your wellness.",
            url: "https://www.yourdomain.com",
            siteName: "Blue Tea",
            images: [
                {
                    url: "/images/og-home.jpg",
                    width: 1200,
                    height: 630,
                },
            ],
            locale: "en_US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: "Blue Tea | Natural & Organic Products",
            description: "Discover the finest selection of organic teas and natural products. Fresh, healthy, and crafted for your wellness.",
            images: ["/images/og-home.jpg"],
        },
    };
};


export default async function Home() {
    const [products, articles, comments, categories] = await Promise.all([
        getTopProducts(),
        getLatestArticles(5),
        getLatestComments(10),
        getCategories().catch(() => []),
    ])

    return (
        <>
            <Banner />
            <About />
            <Menu />
            <Reservation />
            <Products
                products={products}
                categories={categories} />
            <Offers />
            <Reviews
                comments={comments} />
            <Barista />
            <Articles
                articles={articles} />
            <Contact />
        </>
    );
}