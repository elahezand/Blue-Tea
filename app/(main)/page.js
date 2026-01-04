import connectToDB from "@/db/db";
import dynamic from "next/dynamic";
import ProductModel from "@/model/product";
import ArticleModel from "@/model/article";
import commentModel from "@/model/comment";
import Menu from "@/components/template/index/menu/menu";
import About from "@/components/template/index/about/about";

const Barista = dynamic(() => import("@/components/template/index/barista/barista"))
const Reviews = dynamic(() => import("@/components/template/index/reviews/reviews"))
const Reservation = dynamic(() => import("@/components/template/index/reservation/reservation"))
const Articles = dynamic(() => import("@/components/template/index/articles/articles"))
const Contact = dynamic(() => import("@/components/template/index/contact/contact"))
const Products = dynamic(() => import("@/components/template/index/products/products"))


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
    await connectToDB()
    const [products, articles, comments] = await Promise.all([
        ProductModel.find({ score: { $gte: 4 } }).lean(),
        ArticleModel.find({}).sort({ _id: -1 }).limit(5).lean(),
        commentModel.find({}).sort({ _id: -1 }).limit(10).lean(),
    ])

    const safeProducts = JSON.parse(JSON.stringify(products))
    const safeArticles = JSON.parse(JSON.stringify(articles))
    const safeComments = JSON.parse(JSON.stringify(comments))

    return (
        <>
            <About />
            <Menu />
            <Products
                products={safeProducts} />
            <Reviews
                comments={safeComments} />
            <Barista />
            <Articles
                articles={safeArticles} />
            <Contact />
            <Reservation />
        </>
    );
}
