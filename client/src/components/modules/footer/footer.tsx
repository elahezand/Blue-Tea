import Link from "next/link"
import Logo from "@/components/modules/logo"
import { SHOP } from "@/components/modules/shopInfo"

const links = [
    { href: "/#menu", label: "Menu" },
    { href: "/products", label: "Store" },
    { href: "/articles", label: "Journal" },
    { href: "/about", label: "About" },
    { href: "/contact-us", label: "Contact" },
]

export default function Footer() {
    return (
        <footer className="bg-[var(--navy)] text-[var(--cream)]">
            <div className="container pt-10 pb-6 sm:pt-12 sm:pb-8">
                <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-[1fr_1fr_minmax(14rem,0.85fr)] lg:gap-10">
                    <div>
                        <Link href="/" className="inline-flex w-fit" aria-label="Blue Tea, home"><Logo size={32} light /></Link>
                        <p className="mt-3 mb-0 max-w-xs text-sm leading-relaxed text-[var(--cream)]/75">
                            Tea, coffee and fresh pastries at the café. Loose leaves and brewers from the shop.
                        </p>
                    </div>
                    <nav aria-label="Footer">
                        <h2 className="mb-2 font-body text-sm font-semibold text-[var(--lamp)]">Explore</h2>
                        <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-1 p-0 text-sm">
                            {links.map(({ href, label }) => (
                                <li key={href}>
                                    <Link href={href} className="inline-flex min-h-10 items-center text-[var(--cream)]/85 hover:text-[var(--lamp)]">{label}</Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div>
                        <h2 className="mb-2 font-body text-sm font-semibold text-[var(--lamp)]">Opening hours</h2>
                        <dl className="m-0 max-w-xs text-sm text-[var(--cream)]/85">
                            {SHOP.hours.map(({ days, time }) => (
                                <div key={days} className="flex justify-between gap-3 py-1">
                                    <dt>{days}</dt>
                                    <dd className="m-0 whitespace-nowrap tabular-nums">{time}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
                <div className="mt-7 flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-t border-white/15 pt-3 text-sm text-[var(--cream)]/75">
                    <span>© {new Date().getFullYear()} Blue Tea</span>
                    <a href={SHOP.phoneHref} className="inline-flex min-h-10 items-center hover:text-[var(--lamp)]">{SHOP.phone}</a>
                </div>
            </div>
        </footer>
    )
}
