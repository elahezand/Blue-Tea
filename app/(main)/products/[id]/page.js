import connectToDB from "@/configs/db";
import ProductGallery from "@/components/template/productDetail/ProductGallery";
import ProductComments from "@/components/template/productDetail/ProductComments";
import commentModel from "@/model/comment";
import { getMe } from "@/utils/auth";
import { paginate } from "@/utils/helper";
import ProductModal from "@/model/product";
import AddToCart from "@/components/template/productDetail/addToCart";

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
  const user = await getMe()

  const { id } = await params
  const product = await ProductModal.findById(id).lean()
  const searchparams = await searchParams
  
  const paginatedData = await paginate(
    commentModel,               // Model
    searchparams,               // searchParams
    { product: id }, // filter
    null,                       // populate
    true,
    false                  // cursor /page
  );

  return (
    <div className="container py-5">
      <div className="row">
        {/* Images */}
        <ProductGallery images={product.img} />
        {/* Product Details */}
        <div className="col-md-6 p-5">
          <h2 className="text-white">{product.name}</h2>
          <p className="text-white">{product.shortDescription}</p>
          <p className="fs-4 text-white"> $ {product.price}</p>
          <AddToCart
            productID={JSON.parse(JSON.stringify(product._id))}
            img={product.img}
            name={product.name}
            price={product.price}
          />
          <hr />
          <strong className=" text-white">About This Item:</strong>
          <p className=" text-white">{product.longDescription}</p>
          <hr />
          <h5 className="text-white" >Features:</h5>
          <ul>
            <li className=" text-white">Mild and calming aroma</li>
            <li className=" text-white">100% Organic</li>
            <li className=" text-white">Promotes better sleep and reduces stress</li>
          </ul>
        </div>
        <hr />
        <ProductComments
          nextCursor={paginatedData.nextCursor}
          limit={paginatedData.limit}
          comments={JSON.parse(JSON.stringify(paginatedData.data))}
          productID={product._id.toString()}
          userID={user.id.toString()}
        />
      </div>
    </div>
  );
}
