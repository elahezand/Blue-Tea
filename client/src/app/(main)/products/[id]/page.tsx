import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { RouteProps } from "@/types/api"
import { getProductById } from "@/services/product.service";
import { getProductComments } from "@/services/comment.service";
import ProductView from "@/components/template/productDetail/productView";
import { firstImage } from "@/utils/helper";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL

export async function generateMetadata({ params }: Pick<RouteProps<{ id: string }>, "params">): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Product not found", robots: { index: false } };

  const description = product.shortDescription || "Loose-leaf teas, coffee and pantry things from Blue Tea.";
  const images = Array.isArray(product.img) ? product.img : product.img ? [product.img] : [];
  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${product._id}` },
    openGraph: { title: product.name, description, url: `/products/${product._id}`, type: "website", images },
    twitter: { card: "summary_large_image", title: product.name, description, images },
  };
}

export default async function Page({ params }: Pick<RouteProps<{ id: string }>, "params">) {
  const { id } = await params
  const [product, comments] = await Promise.all([
    getProductById(id),
    getProductComments(id).catch(() => null),
  ])
  if (!product) notFound()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: firstImage(product.img) || undefined,
    url: `${SITE_URL}/products/${product._id}`,
    offers: { "@type": "Offer", price: product.price, priceCurrency: "USD", availability: product.isAvailable === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock" },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <ProductView product={product} comments={comments} />
    </>
  );
}
