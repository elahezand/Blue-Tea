import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MdPhone, MdMailOutline, MdPlace } from 'react-icons/md'
import { Reveal } from '@/components/modules/motion'
import { SHOP } from '@/components/modules/shopInfo'

/* Home page section: a note from the shop with direct ways to reach us. */
export default function Contact() {
    const rows = [
        { Icon: MdPhone, label: "Call us", value: SHOP.phone, href: SHOP.phoneHref },
        { Icon: MdMailOutline, label: "Write to us", value: SHOP.email, href: `mailto:${SHOP.email}` },
        { Icon: MdPlace, label: "Visit us", value: SHOP.address.split(",").slice(0, 2).join(","), href: "/contact-us" },
    ]
    return (
        <section className="!py-14 lg:!py-20">
            <div className="container">
                <Reveal y={18} className="grid items-center gap-8 rounded-3xl border-2 border-dashed border-line bg-surface p-6 sm:p-10 lg:grid-cols-12 lg:gap-10">
                    <div className="lg:col-span-5">
                        <span className="script mb-1 inline-block -rotate-2 text-3xl text-[var(--green)]">Say hello</span>
                        <h2 className="m-0 mb-3 max-w-lg text-3xl leading-tight font-medium md:text-4xl" style={{ color: "var(--head)" }}>Questions about an order, a private booking or a blend?</h2>
                        <p className="m-0 mb-7 max-w-md text-base text-muted">Write to us and we will reply within a day. Or reach us directly:</p>
                        <ul className="m-0 mb-8 flex list-none flex-col gap-3 p-0">
                            {rows.map(({ Icon, label, value, href }) => (
                                <li key={label}>
                                    <Link href={href} className="group flex items-center gap-4 text-fg">
                                        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--green)]/15 text-xl text-[var(--green-text)] transition-colors group-hover:bg-[var(--green)] group-hover:text-white"><Icon aria-hidden /></span>
                                        <span className="min-w-0">
                                            <span className="block text-sm text-muted">{label}</span>
                                            <span className="block truncate font-medium">{value}</span>
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <Link href="/contact-us" className="inline-flex items-center justify-center rounded-full bg-brown px-7 py-3.5 text-sm font-medium !text-white shadow-[0_10px_22px_-12px_var(--accent)] transition hover:-translate-y-0.5">Send a message</Link>
                    </div>
                    <div className="lg:col-span-7">
                        <div className="no-tint relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-t-[160px] rounded-b-2xl bg-soft shadow-[0_0_0_8px_var(--surface),0_0_0_9px_var(--line)] sm:aspect-[16/10] sm:max-w-none sm:rounded-t-[120px] lg:aspect-[4/3] lg:rounded-t-[200px]">
                            <Image src="/images/cafe-seating.jpg" alt="Inside Blue Tea: navy velvet chairs and marble tables"
                                fill sizes="(min-width: 1024px) 58vw, 100vw" className="no-tint object-cover object-[50%_45%]" />
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    )
}