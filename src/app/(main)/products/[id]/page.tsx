import type { RouteProps } from "@/types/api"
import { getProductById } from "@/services/product.service";
import { getProductComments } from "@/services/comment.service";
import ProductView from "@/components/template/productDetail/productView";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: Pick<RouteProps<{ id: string }>, "params">) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: "Product Not Found | Blue Tea",
      description: "The requested product could not be found.",
    };
  }

  return {
    title: `${product.name} | Blue Tea`,
    description: product.shortDescription || "Loose-leaf teas, coffee and pantry things from Blue Tea.",
    openGraph: {
      title: `${product.name} | Blue Tea`,
      description: product.shortDescription || "High-quality natural products for your healthy lifestyle.",
      url: `https://www.yourdomain.com/products/${product._id}`,
      siteName: "Blue Tea",
      images: Array.isArray(product.img)
        ? product.img.map((img) => ({ url: img, width: 800, height: 600 }))
        : product.img
          ? [{ url: product.img, width: 800, height: 600 }]
          : [],
      locale: "en_US",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Blue Tea`,
      description: product.shortDescription || "High-quality natural products for your healthy lifestyle.",
      images: Array.isArray(product.img) ? product.img : product.img ? [product.img] : [],
    },
  };

}

export default async function Page({ params, searchParams }: RouteProps<{ id: string }>) {
  const { id } = await params
  const product = await getProductById(id)
  if (!product) notFound()
  const searchparams = await searchParams
  const paginatedData = await getProductComments(id, searchparams);

  return (
    <ProductView
      product={product}
      comments={paginatedData.data}
      nextCursor={paginatedData.nextCursor}
      limit={paginatedData.limit} />
  );
}
