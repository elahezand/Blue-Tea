import connectToDB from "@/db/db";
import dynamic from "next/dynamic";
import ProductModal from "@/model/product";
import ArticleModel from "@/model/article";
import commentModel from "@/model/comment";
import Menu from "@/components/template/index/menu/menu";
import About from "@/components/template/index/about/about";


const Products = dynamic(() => import("@/components/template/index/products/products"))
const Barista = dynamic(() => import("@/components/template/index/barista/barista"))
const Reviews = dynamic(() => import("@/components/template/index/reviews/reviews"))
const Reservation = dynamic(() => import("@/components/template/index/reservation/reservation"))
const Articles = dynamic(() => import("@/components/template/index/articles/articles"))
const Contact = dynamic(() => import("@/components/template/index/contact/contact"))


export const generateMetadata = async () => {
    return {
        title: "Tea Shop | Natural & Organic Products",
        description: "Discover the finest selection of organic teas and natural products. Fresh, healthy, and crafted for your wellness.",
        openGraph: {
            title: "Tea Shop | Natural & Organic Products",
            description: "Discover the finest selection of organic teas and natural products. Fresh, healthy, and crafted for your wellness.",
            url: "https://www.yourdomain.com",
            siteName: "Tea Shop",
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
            title: "Tea Shop | Natural & Organic Products",
            description: "Discover the finest selection of organic teas and natural products. Fresh, healthy, and crafted for your wellness.",
            images: ["/images/og-home.jpg"],
        },
    };
};


export default async function Home() {
    await connectToDB()
    const products = await ProductModal
        .find({ score: 5 })
        .lean()
    const articles = await ArticleModel.find({})
        .sort({ _id: -1 })
        .limit(5)
        .lean();
    const comments = await commentModel.find({})
        .sort({ _id: -1 })
        .limit(10)
        .lean();


    return (
        <>
            <About />
            <Menu />
            <Products
                products={JSON.parse(JSON.stringify(products))} />
            <Barista />
            <Reviews comments={JSON.parse(JSON.stringify(comments))} />
            <Articles articles={JSON.parse(JSON.stringify(articles))} />
            <Contact />
            <Reservation />
        </>
    );
}
