import connectToDB from "@/db/db";
import ProductGallery from "@/components/template/productDetail/ProductGallery";
import ProductComments from "@/components/template/productDetail/ProductComments";
import commentModel from "@/model/comment";
import ProductModal from "@/model/product";
import AddToCart from "@/components/template/productDetail/addToCart";


export async function generateMetadata({ params }) {
  await connectToDB();
  const { id } = await params;
  const product = await ProductModal.findOne({ _id: id }).lean();

  if (!product) {
    return {
      title: "Product Not Found | Tea Shop",
      description: "The requested product could not be found.",
    };
  }

  return {
    openGraph: {
      title: `${product.name} | Tea Shop`,
      description: product.shortDescription || "High-quality natural products for your healthy lifestyle.",
      url: `https://www.yourdomain.com/products/${product._id}`,
      siteName: "Tea Shop",
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
      title: `${product.name} | Tea Shop`,
      description: product.shortDescription || "High-quality natural products for your healthy lifestyle.",
      images: Array.isArray(product.img) ? product.img : product.img ? [product.img] : [],
    },
  };

}

export default async function Page({ params, searchParams }) {
  connectToDB()
  const { id } = await params

  const limit = Number(searchParams.limit) || 15;
  const cursor = searchParams.cursor || null;

  const product = await ProductModal.findOne({ _id: id }).lean();

  const query = cursor
    ? { _id: { $gt: cursor }, productID: product._id }
    : { productID: product._id };

  const comments = await commentModel
    .find(query)
    .sort({ _id: 1 })
    .limit(limit + 1)
    .lean();


  const hasNextPage = comments.length > limit;
  if (hasNextPage) comments.pop();

  const nextCursor = hasNextPage
    ? comments[comments.length - 1]._id.toString()
    : null;



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
          limit={limit}
          nextCursor={nextCursor}
          comments={comments}
          productID={product._id.toString()}
        />
      </div>
    </div>
  );
}
