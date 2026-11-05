"use client"
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Reveal, Stagger, Item } from '@/components/modules/motion'

/* The top of the footer: a short invitation to write to us, with a photo fading into the same navy as the rest of the footer.
   Hidden on the contact page itself. */
export default function FooterCta() {
    if (usePathname() === "/contact-us") return null
    return (
        <div className="relative overflow-hidden">
            <div className="grid min-h-[300px] lg:grid-cols-2">
                <Stagger gap={0.12} className="relative z-10 flex flex-col justify-center gap-4 px-6 py-12 lg:py-16 lg:pr-12 lg:pl-[calc((100vw-960px)/2+0.75rem)] min-[1200px]:pl-[calc((100vw-1140px)/2+0.75rem)] min-[1400px]:pl-[calc((100vw-1320px)/2+0.75rem)]">
                    <Item as="h2" className="m-0 max-w-md text-3xl leading-tight font-semibold !text-white">Questions about an order, a private booking or a blend you cannot find?</Item>
                    <Item as="p" className="m-0 max-w-md text-base text-white/75">Write to us and we will reply within a day.</Item>
                    <Item>
                        <Link href="/contact-us" className="inline-flex rounded-full bg-white px-8 py-3 text-sm font-medium !text-[var(--navy)] transition hover:-translate-y-0.5 hover:shadow-lg">Contact us</Link>
                    </Item>
                </Stagger>
                <Reveal x={60} y={0} className="relative min-h-[200px] lg:min-h-0">
                    <Image src="/images/cafe-seating.jpg" alt="Inside Blue Tea: navy velvet chairs and marble tables"
                        fill sizes="(min-width: 1024px) 50vw, 100vw" className="no-tint object-cover object-[50%_45%]" />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[var(--navy)] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[var(--navy)] lg:via-[var(--navy)]/25" />
                    <div aria-hidden className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-[var(--navy)] to-transparent lg:hidden" />
                </Reveal>
            </div>
            {/* soften the bottom edge so the photo melts into the columns below */}
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-[var(--navy)]" />
        </div>
    )
}
