import Link from "next/link"
import { MdOutlineDirections, MdOutlinePlace } from "react-icons/md"
import { SHOP, SHOP_DIRECTIONS_URL } from "@/components/modules/shopInfo"

export default function Contact() {
    return (
        <section aria-labelledby="visit-title" className="bg-soft !py-14 lg:!py-20">
            <div className="container flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
                <div>
                    <h2 id="visit-title" className="m-0 text-3xl tracking-tight text-[var(--head)] sm:text-4xl">Visit Blue Tea</h2>
                    <address className="mt-3 flex items-start gap-2 text-muted not-italic">
                        <MdOutlinePlace aria-hidden className="mt-0.5 shrink-0 text-xl text-link" />
                        {SHOP.address}
                    </address>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <a href={SHOP_DIRECTIONS_URL} target="_blank" rel="noreferrer" className="btn btn-primary">
                        <MdOutlineDirections aria-hidden className="text-lg" />
                        Get directions
                    </a>
                    <Link href="/contact-us" className="btn btn-outline bg-surface">Contact us</Link>
                </div>
            </div>
        </section>
    )
}
