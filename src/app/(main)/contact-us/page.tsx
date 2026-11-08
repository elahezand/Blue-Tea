import type { Metadata } from 'next'
import Logo from "@/components/modules/logo"
import { MdOutlineAccessTime, MdOutlineLocationOn, MdOutlineMail, MdOutlinePhone } from "react-icons/md"
import { SHOP } from "@/components/modules/shopInfo";
import { PageHeader, Reveal } from "@/components/modules/motion";
import ContactForm from '@/components/template/contact/contactForm';

const DESCRIPTION = "Questions about an order, a private booking or a blend? Write to Blue Tea and we will reply within a day."

export const metadata: Metadata = {
    title: "Contact us",
    description: DESCRIPTION,
    alternates: { canonical: "/contact-us" },
    openGraph: { title: "Contact Blue Tea", description: DESCRIPTION, url: "/contact-us", type: "website" },
    twitter: { card: "summary", title: "Contact Blue Tea", description: DESCRIPTION },
};

export default function page() {
    const row = "flex items-start gap-3"
    const icon = "mt-1 shrink-0 text-[var(--lamp)]"
    return (
        <>
            <PageHeader
                crumbs={["Contact"]}
                script="Say hello" title="Get in touch"
                intro="Questions about an order, a private booking or a blend? Write to us and we will reply within a day." />
            <section className="!pt-10 lg:!pt-12">
                <div className="container grid items-stretch gap-8 lg:grid-cols-12">
                    <Reveal className="lg:col-span-7 [&>*]:h-full">
                        <ContactForm />
                    </Reveal>
                    <Reveal delay={0.12} className="lg:col-span-5 [&>*]:h-full">
                        <div className="board relative flex flex-col overflow-hidden">
                            <Logo size={210} text={false} light className="pointer-events-none absolute end-8 top-[34%] opacity-[0.08]" />
                            <div className="relative flex flex-1 flex-col p-6 sm:p-8">
                                <span className="script text-3xl text-[var(--lamp)]">Come say hi</span>
                                <h2 className="mb-5 mt-1 text-2xl font-semibold" style={{ color: "var(--cream)" }}>Visit or call</h2>
                                <address className="m-0 flex flex-col gap-4 text-sm not-italic text-[var(--cream)]">
                                    <div className={row}><MdOutlineLocationOn className={icon} /><span>{SHOP.address} <a className="ms-1 font-medium text-[var(--lamp)] underline underline-offset-4" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SHOP.address)}`}>Get directions</a></span></div>
                                    <div className={row}><MdOutlinePhone className={icon} /><a href={SHOP.phoneHref} className="hover:text-[var(--lamp)]">{SHOP.phone}</a></div>
                                    <div className={row}><MdOutlineMail className={icon} /><a href={`mailto:${SHOP.email}`} className="hover:text-[var(--lamp)]">{SHOP.email}</a></div>
                                </address>
                                <h3 className="mb-2 mt-auto flex items-center gap-2 pt-8 text-base font-semibold" style={{ color: "var(--cream)" }}><MdOutlineAccessTime className="text-[var(--lamp)]" />Opening hours</h3>
                                <ul className="m-0 list-none p-0 text-sm text-[var(--cream)]">
                                    {SHOP.hours.map((h: { days: string; time: string }, i: number) => (
                                        <li key={h.days} className={`flex justify-between gap-4 py-2 ${i < SHOP.hours.length - 1 ? "border-b border-dotted border-white/25" : ""}`}>
                                            <span className="opacity-80">{h.days}</span><span className="script text-xl text-[var(--lamp)]">{h.time}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>
        </>
    )
}