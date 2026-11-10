import Image from 'next/image'
import { Portrait } from '@/components/modules/illustrations'
import { SectionHeader, Stagger, Item } from '@/components/modules/motion'

const team = [
    { name: "Steve", role: "Founder", img: "/images/team/portrait-elegant-old-man-wearing-suit.jpg" },
    { name: "Sandra", role: "Manager", img: "/images/team/cute-korean-barista-girl-pouring-coffee-prepare-filter-batch-brew-pour-working-cafe.jpg" },
    { name: "Jackson", role: "Senior barista", img: "/images/team/small-business-owner-drinking-coffee.jpg" },
    { name: "Michelle", role: "Barista and shop", img: "/images/team/smiley-business-woman-working-cashier.jpg" },
]

export default function Barista() {
    return (
        <section className="!py-14 lg:!py-20">
            <div className="container">
                <SectionHeader script="Say hello" title="The people behind the counter" text="Four of us, one counter. Come and say hi." className="mb-12" />
                <Stagger gap={0.1} as="ul" className="m-0 mx-auto grid max-w-5xl list-none grid-cols-2 gap-x-5 gap-y-12 p-0 sm:gap-x-8 lg:grid-cols-4">
                    {team.map((b, i) => (
                        <Item as="li" key={b.name} y={18} className={`group flex flex-col items-center text-center ${i % 2 ? "lg:mt-12" : ""}`}>
                            <div className="relative w-full max-w-[15rem]">
                                <span aria-hidden className="absolute inset-0 -translate-y-2.5 translate-x-2.5 rounded-t-[999px] rounded-b-2xl border border-dashed border-[var(--green)]/60 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1.5" />
                                <div className="no-tint relative aspect-[4/5] w-full overflow-hidden rounded-t-[999px] rounded-b-2xl bg-soft shadow-sm">
                                    {b.img
                                        ? <Image src={b.img} alt={`${b.name}, ${b.role}`} width={416} height={520} className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        : <Portrait index={i} label={`${b.name}, ${b.role}`} className="size-full" />}
                                </div>
                            </div>
                            <h3 className="m-0 mt-5 font-display text-xl text-fg">{b.name}</h3>
                            <p className="m-0 mt-0.5 text-sm text-muted">{b.role}</p>
                        </Item>
                    ))}
                </Stagger>
            </div>
        </section>
    )
}