import connectToDB from "@/db/db";
import ArticleModel from "@/model/article";
import Image from "next/image";
import Link from "next/link";
import styles from '@/components/template/index/articles/articles.module.css';

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }) {
  await connectToDB();
  const { id } = await params
  const article = await ArticleModel.findOne({ _id: id }).lean();

  return {
    title: article?.title || "Article",
    description: article?.shortDescription || "Read this article",
    openGraph: {
      title: article?.title,
      description: article?.shortDescription,
      images: article?.cover ? [article.cover] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article?.title,
      description: article?.shortDescription,
      images: article?.cover ? [article.cover] : [],
    },
  };
}

export default async function ArticlePage({ params }) {
  await connectToDB();
  const { id } = await params;

  // Fetch the main article
  const article = await ArticleModel.findOne({ _id: id }).lean();

  // Fetch other articles
  const otherArticles = await ArticleModel.find({ _id: { $ne: id } })
    .sort({ createdAt: -1 })
    .limit(4)
    .lean();

  return (
    <div className="py-5">
      {/* Article Header */}
      <div className="header mb-5">
        <h1 className="text-white">{article?.title}</h1>
      </div>

      <div className="container">
        <div className="row align-items-center">
          {/* Article Image */}
          {article?.cover && (
            <div className={`${styles.img_container} col-md-6`}>
              <Image
                src={article.cover}
                alt={article.title}
                width={600}
                height={400}
                className={styles.article_cover}
                priority
              />
            </div>
          )}

          {/* Article Content */}
          <div className="col-md-6 p-4">
            <p className="text-white fw-bold fs-5">{article?.shortDescription}</p>
            <hr />
            <div className="text-white">
              {article?.content && (
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              )}
            </div>
            <hr />
            <h5 className="text-white">Features / Highlights:</h5>
            <ul>
              {article?.features?.map((feature, idx) => (
                <li key={idx} className="text-white">{feature}</li>
              ))}
            </ul>
            <p className="text-white mt-3">
              <strong>Author:</strong> {article?.author}
            </p>
          </div>
        </div>

        {/* Other Articles */}
        <div className="col-12 my-5">
          <div className="d-flex justify-content-between mb-3">
            <h4 className="text-white fw-bold">Other Articles</h4>
            <Link href="/articles" className="classic">
              More...
            </Link>
          </div>
          <div className="row g-3">
            {otherArticles.map((a) => (
              <div key={a._id} className="col-md-3">
                <div className={styles.article_image_wrap}>
                  <Image
                    src={a.cover}
                    alt={a.title}
                    width={300}
                    height={200}
                    priority
                    className={styles.article_image}
                  />
                  <Link href={`/articles/${a._id}`} className={styles.article_overlay}>
                    <h5>{a.title}</h5>
                    <p>{a.shortDescription}</p>
                    <span className={styles.author}>{a.author}</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
