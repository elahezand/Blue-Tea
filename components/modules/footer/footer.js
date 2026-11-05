import React from 'react'
import Link from 'next/link'
import Logo from '@/components/modules/logo'
import FooterCta from '@/components/modules/footer/FooterCta'
import { SHOP } from '@/components/modules/shopInfo'
import { FaFacebookF, FaWhatsapp, FaXTwitter } from "react-icons/fa6"

const social = "flex size-10 items-center justify-center rounded-full border border-solid border-white/25 text-[var(--cream)] transition hover:bg-white/10"
const title = "mb-3 font-body text-sm font-semibold text-white"
const a = "inline-block py-1.5 text-[var(--cream)]/70 transition-colors hover:text-white"

export default function Footer() {
    return (
        <footer className="bg-[var(--navy)] text-[var(--cream)]">
            <FooterCta />
            <div className="container pt-12 pb-8">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
                    <div className="sm:col-span-2 lg:col-span-4">
                        <Link href="/" className="mb-4 inline-block text-[var(--cream)]" aria-label="Blue Tea, home"><Logo size={36} light /></Link>
                        <p className="mb-5 max-w-xs text-sm text-[var(--cream)]/70">Tea and coffee made to order, with a small shop of leaves, brewers and cups next door.</p>
                        <div className="flex gap-2">
                            <a href="#" aria-label="WhatsApp" className={social}><FaWhatsapp /></a>
                            <a href="#" aria-label="Twitter" className={social}><FaXTwitter /></a>
                            <a href="#" aria-label="Facebook" className={social}><FaFacebookF /></a>
                        </div>
                    </div>
                    <nav className="lg:col-span-2" aria-label="Footer">
                        <h2 className={title}>Explore</h2>
                        <ul className="m-0 flex list-none flex-col gap-0.5 p-0 text-sm">
                            <li><Link className={a} href="/products">Store</Link></li>
                            <li><Link className={a} href="/#menu">Menu</Link></li>
                            <li><Link className={a} href="/articles">Journal</Link></li>
                            <li><Link className={a} href="/about">About</Link></li>
                            <li><Link className={a} href="/contact-us">Contact</Link></li>
                        </ul>
                    </nav>
                    <div className="lg:col-span-3">
                        <h2 className={title}>Visit</h2>
                        <address className="mb-3 text-sm not-italic text-[var(--cream)]/70">{SHOP.address}</address>
                        <p className="mb-1 text-sm"><a href={SHOP.phoneHref} className={a}>{SHOP.phone}</a></p>
                        <p className="mb-0 text-sm"><a href={`mailto:${SHOP.email}`} className={a}>{SHOP.email}</a></p>
                    </div>
                    <div className="lg:col-span-3">
                        <h2 className={title}>Opening hours</h2>
                        <ul className="m-0 list-none p-0 text-sm">
                            {SHOP.hours.map((h, i) => (
                                <li key={h.days} className={`flex justify-between gap-4 py-2 ${i < SHOP.hours.length - 1 ? "border-b border-white/15" : ""}`}>
                                    <span className="text-[var(--cream)]/70">{h.days}</span>
                                    <span className="font-medium text-white">{h.time}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-6 text-xs text-[var(--cream)]/60">
                    <span>© {new Date().getFullYear()} Blue Tea. All rights reserved.</span>
                    <span className="script text-2xl text-[var(--lamp)]">Come back soon</span>
                </div>
            </div>
            <div aria-hidden className="floor" />
        </footer>
    )
}
