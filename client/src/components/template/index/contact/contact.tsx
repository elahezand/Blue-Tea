import Image from 'next/image'
import Link from 'next/link'
import { MdPhone, MdMailOutline, MdPlace } from 'react-icons/md'
import { Reveal } from '@/components/modules/motion'
import { SHOP } from '@/components/modules/shopInfo'

// Last section of the page: a calm, full-width photo of the café with the ways to reach us on top.
// No tape, tilt or paper here, so the page ends quietly.
export default function Contact() {
    const rows = [
        { Icon: MdPhone, label: "Call us", value: SHOP.phone, href: SHOP.phoneHref },
        { Icon: MdMailOutline, label: "Write to us", value: SHOP.email, href: `mailto:${SHOP.email}` },
        { Icon: MdPlace, label: "Visit us", value: SHOP.address.split(",").slice(0, 2).join(","), href: "/contact-us" },
    ]
    return (
        <section className="relative isolate overflow-hidden !py-14 lg:!py-20">
            <Image src="/images/cafe-seating.jpg" alt="" fill sizes="100vw" className="no-tint -z-10 object-cover object-[50%_45%]" />
            <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(14,26,58,0.78),rgba(14,26,58,0.88))]" />

            <Reveal y={18} className="container flex flex-col items-center text-center">
                <h2 className="m-0 mb-4 max-w-2xl text-4xl leading-tight font-medium !text-white md:text-5xl">Questions about an order, a private booking or a blend?</h2>
                <p className="m-0 mb-12 max-w-lg text-lg text-white/75">Write to us and we will reply within a day.</p>

                <ul className="m-0 mb-12 grid w-full max-w-4xl list-none gap-px overflow-hidden rounded-2xl bg-white/15 p-0 sm:grid-cols-3">
                    {rows.map(({ Icon, label, value, href }) => (
                        <li key={label} className="bg-[rgba(14,26,58,0.55)] backdrop-blur-sm">
                            <Link href={href} className="group flex h-full flex-col items-center gap-2 px-6 py-7 !text-white transition-colors hover:bg-white/5">
                                <Icon aria-hidden className="text-2xl text-[var(--lamp)]" />
                                <span className="text-xs tracking-[0.2em] text-white/60 uppercase">{label}</span>
                                <span className="max-w-full truncate font-medium">{value}</span>
                            </Link>
                        </li>
                    ))}
                </ul>

                <Link href="/contact-us" className="btn btn-light btn-lg">Send a message</Link>
            </Reveal>
        </section>
    )
}