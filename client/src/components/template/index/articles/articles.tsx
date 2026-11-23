import { SectionHeader } from '@/components/modules/motion'
import type { Article } from "@/types/article"
import Image from 'next/image'
import Link from 'next/link'
import { MdArrowForward } from "react-icons/md"

export default function ArticlesSection({ articles = [] }: { articles?: Article[] }) {
    const [lead, ...rest] = articles.slice(0, 4)
    if (!lead) return null
    return (
        <section aria-labelledby="home-journal-title">
            <div className="container">
                <SectionHeader titleId="home-journal-title" script="Fresh from the pot" title="From the journal" className="mb-8 sm:mb-12" />
                <div className={`grid items-start gap-8 ${rest.length ? "lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.85fr)] lg:gap-12" : "mx-auto max-w-3xl"}`}>
                    <article className="min-w-0">
                        <Link href={`/articles/${lead._id}`} className="group block rounded-xl">
                            {lead.cover && (
                                <div className="no-tint relative aspect-[16/10] overflow-hidden rounded-xl bg-soft">
                                    <Image src={lead.cover} alt="" fill sizes="(min-width: 992px) 58vw, 100vw" className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.035]" />
                                </div>
                            )}
                            <div className="mt-5 flex items-start justify-between gap-4">
                                <h3 className="m-0 max-w-[26ch] font-display text-2xl leading-tight text-fg group-hover:text-link sm:text-3xl xl:text-4xl">{lead.title}</h3>
                                <MdArrowForward aria-hidden className="mt-1 size-5 shrink-0 text-link" />
                            </div>
                            {lead.shortDescription && <p className="mt-3 mb-0 max-w-prose text-sm leading-relaxed text-muted sm:text-base">{lead.shortDescription}</p>}
                            {lead.author && <p className="mt-3 mb-0 text-sm font-medium text-muted">{lead.author}</p>}
                        </Link>
                    </article>
                    {rest.length > 0 && (
                        <ul className="m-0 list-none divide-y divide-line border-y border-line p-0">
                            {rest.map((article) => (
                                <li key={article._id}>
                                    <Link href={`/articles/${article._id}`} className="group flex min-h-24 items-center gap-3 py-3.5 sm:gap-4">
                                        <div className="min-w-0 flex-1">
                                            <h3 className="m-0 font-display text-lg leading-snug text-fg group-hover:text-link sm:text-xl">{article.title}</h3>
                                            {article.author && <p className="mt-1 mb-0 text-sm text-muted">{article.author}</p>}
                                        </div>
                                        {article.cover && (
                                            <div className="no-tint size-16 shrink-0 overflow-hidden rounded-lg bg-soft sm:size-20">
                                                <Image src={article.cover} alt="" width={160} height={160} className="size-full object-cover" />
                                            </div>
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="mt-8 flex justify-center sm:mt-10">
                    <Link href="/articles" className="btn btn-outline">All articles<MdArrowForward aria-hidden className="size-4" /></Link>
                </div>
            </div>
        </section>
    )
}
