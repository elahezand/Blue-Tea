import { Stagger, Item, SectionHeader, Reveal } from '@/components/modules/motion'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

/* Journal: the newest article gets a big cover on the left; the header and a quiet list sit on the right. */
export default function ArticlesSection({ articles = [] }) {
    const [lead, ...rest] = articles.slice(0, 4)
    if (!lead) return null
    return (
        <section className="!py-14 lg:!py-20">
            <div className="container grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
                <Reveal className="min-w-0 lg:col-span-6">
                    <Link href={`/articles/${lead._id}`} className="group block">
                        <div className="no-tint relative aspect-[4/3] overflow-hidden rounded-3xl bg-soft shadow-sm">
                            <Image src={lead.cover} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
                        </div>
                        <h3 className="m-0 mt-5 font-display text-2xl text-fg transition-colors group-hover:text-link">{lead.title}</h3>
                        <p className="m-0 mt-1 text-sm text-muted">{lead.author}</p>
                    </Link>
                </Reveal>
                <div className="min-w-0 lg:col-span-6">
                    <SectionHeader align="start" script="Fresh from the pot" title="From the journal" href="/articles" linkLabel="All articles" className="mb-6" />
                    {rest.length > 0 && (
                        <Stagger as="ul" gap={0.08} className="m-0 list-none p-0">
                            {rest.map((a) => (
                                <Item as="li" key={a._id} y={12} className="border-b border-line first:border-t">
                                    <Link href={`/articles/${a._id}`} className="group flex items-center gap-4 py-4">
                                        <div className="no-tint size-16 shrink-0 overflow-hidden rounded-xl bg-soft">
                                            <Image src={a.cover} alt="" width={160} height={160} className="size-full object-cover" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="m-0 truncate font-display text-lg text-fg transition-colors group-hover:text-link">{a.title}</h3>
                                            <p className="m-0 mt-0.5 text-sm text-muted">{a.author}</p>
                                        </div>
                                        <span aria-hidden className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-link">→</span>
                                    </Link>
                                </Item>
                            ))}
                        </Stagger>
                    )}
                </div>
            </div>
        </section>
    )
}
