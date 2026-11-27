import Link from "next/link"
import Logo from "@/components/modules/logo"
import { SHOP, SHOP_DIRECTIONS_URL } from "@/components/modules/shopInfo"

const links = [
    { href: "/#menu", label: "Menu" },
    { href: "/products", label: "Store" },
    { href: "/articles", label: "Journal" },
    { href: "/about", label: "About" },
    { href: "/contact-us", label: "Contact" },
]

export default function Footer() {
    return (
        <footer className="bg-[var(--storefront-chrome)] text-[var(--cream)]">
            <div aria-hidden="true" className="h-2 bg-[repeating-linear-gradient(90deg,var(--cream)_0_2rem,transparent_2rem_4rem)] opacity-75" />
            <div className="container pt-10 pb-6 sm:pt-12 sm:pb-8">
                <div className="grid gap-x-10 gap-y-7 sm:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,0.75fr)]">
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Link href="/" className="inline-flex w-fit" aria-label="Blue Tea, home"><Logo size={32} light seasonal /></Link>
                        <p className="mt-3 mb-0 max-w-xs text-sm leading-relaxed text-[var(--cream)]/75">
                            Tea, coffee and fresh pastries at the café. Loose leaves and brewers from the shop.
                        </p>
                    </div>
                    <div>
                        <h2 className="mb-2 text-xl text-[var(--cream)]">Visit us</h2>
                        <address className="m-0 text-sm not-italic text-[var(--cream)]/85">{SHOP.address}</address>
                        <a href={SHOP_DIRECTIONS_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center text-sm font-medium text-[var(--cream)] underline underline-offset-4 hover:text-[var(--cream)]">Get directions</a>
                        <dl aria-label="Opening hours" className="m-0 mt-2 max-w-xs divide-y divide-white/15 border-y border-white/15 text-sm text-[var(--cream)]/85">
                            {SHOP.hours.map(({ days, time }) => (
                                <div key={days} className="flex justify-between gap-3 py-1.5">
                                    <dt>{days}</dt>
                                    <dd className="m-0 whitespace-nowrap tabular-nums">{time}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                    <nav aria-label="Footer">
                        <h2 className="mb-2 text-xl text-[var(--cream)]">Explore</h2>
                        <ul className="m-0 grid list-none grid-cols-2 gap-x-4 p-0 text-sm">
                            {links.map(({ href, label }) => (
                                <li key={href}>
                                    <Link href={href} className="inline-flex min-h-11 items-center text-[var(--cream)]/85 hover:text-[var(--cream)]">{label}</Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
                <div className="mt-7 flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-t border-white/15 pt-3 text-sm text-[var(--cream)]/75">
                    <span>© {new Date().getFullYear()} Blue Tea</span>
                    <a href={SHOP.phoneHref} className="inline-flex min-h-10 items-center hover:text-[var(--cream)]">{SHOP.phone}</a>
                </div>
            </div>
        </footer>
    )
}
