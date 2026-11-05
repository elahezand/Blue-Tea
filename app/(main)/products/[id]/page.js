import connectToDB from "@/configs/db";
import commentModel from "@/model/comment";
import { paginate } from "@/utils/helper";
import ProductModal from "@/model/product";
import ProductView from "@/components/template/productDetail/productView";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  await connectToDB();
  const { id } = await params;
  const product = await ProductModal.findOne({ _id: id }).lean();

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

export default async function Page({ params, searchParams }) {
  await connectToDB()

  const { id } = await params
  const product = await ProductModal.findById(id).lean()
  if (!product) notFound()
  const searchparams = await searchParams

  const paginatedData = await paginate(
    commentModel,       // Model
    searchparams,       // searchParams
    { product: id },    // filter
    null,               // populate
    true,
    false               // cursor / page
  );

  return (
    <ProductView
      product={JSON.parse(JSON.stringify(product))}
      comments={JSON.parse(JSON.stringify(paginatedData.data))}
      nextCursor={paginatedData.nextCursor}
      limit={paginatedData.limit} />
  );
}
