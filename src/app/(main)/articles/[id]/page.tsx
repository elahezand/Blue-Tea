import type { RouteProps } from "@/types/api"
import { getArticleById, getOtherArticles } from "@/services/article.service";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/modules/motion";

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }: Pick<RouteProps<{ id: string }>, "params">) {
  const { id } = await params
  const article = await getArticleById(id);

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

export default async function ArticlePage({ params }: Pick<RouteProps<{ id: string }>, "params">) {
  const { id } = await params;
  const [article, otherArticles] = await Promise.all([
    getArticleById(id),
    getOtherArticles(id, 4),
  ]);

  return (
    <div className="pb-16">
      <PageHeader crumbs={["Journal"]} title={article?.title || "Article"} intro={article?.author ? `By ${article.author}` : undefined} />
      <div className="container mt-10">
        <div className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-14">
          {article?.cover && (
            <div className="no-tint relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-soft lg:sticky lg:top-24 lg:self-start">
              <Image src={article.cover} alt={article.title || ""} fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
          )}
          <article className={article?.cover ? "" : "lg:col-span-2 max-w-3xl"}>
            {article?.shortDescription && (
              <p className="mb-6 mt-0 font-display text-xl leading-relaxed text-[var(--head)] md:text-2xl">{article.shortDescription}</p>
            )}
            {article?.content && <div className="article-body" dangerouslySetInnerHTML={{ __html: article.content }} />}
            {article?.features && article.features.length > 0 && (
              <div className="mt-8 border-t-2 border-dotted border-line pt-6">
                <h2 className="mb-3 mt-0 text-lg font-semibold text-[var(--head)]">Highlights</h2>
                <ul className="m-0 grid list-none gap-2 p-0">
                  {article.features.map((feature, idx) => (
                    <li key={idx} className="flex gap-3 text-muted"><span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--green)]" />{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        </div>

        {otherArticles.length > 0 && (
          <section className="!px-0 !pb-0 !pt-16 lg:!pt-24" aria-labelledby="more-title">
            <div className="mb-6 flex items-end justify-between gap-4 border-b-2 border-dotted border-line pb-4">
              <div>
                <span className="script block text-2xl text-[var(--green)]">Keep reading</span>
                <h2 id="more-title" className="m-0 text-2xl text-[var(--head)]">More from the journal</h2>
              </div>
              <Link href="/articles" className="text-sm font-medium text-link hover:underline">All articles</Link>
            </div>
            <ul className="m-0 grid list-none gap-x-10 p-0 md:grid-cols-2">
              {otherArticles.map((a) => (
                <li key={a._id} className="border-b border-line">
                  <Link href={`/articles/${a._id}`} className="group flex items-center gap-4 py-4">
                    <div className="no-tint size-16 shrink-0 overflow-hidden rounded-xl bg-soft sm:size-20">
                      {a.cover && <Image src={a.cover} alt="" width={160} height={160} className="size-full object-cover" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="m-0 truncate font-display text-lg text-fg transition-colors group-hover:text-link">{a.title}</h3>
                      <p className="m-0 mt-0.5 text-sm text-muted">{a.author}</p>
                    </div>
                    <span aria-hidden className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-link">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
