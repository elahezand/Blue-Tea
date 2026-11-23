import Image from 'next/image'
import { Portrait } from '@/components/modules/illustrations'
import { Stagger, Item } from '@/components/modules/motion'

const team = [
    { name: "Steve", role: "Founder", favourite: "Double espresso", tilt: -3, img: "/images/team/portrait-elegant-old-man-wearing-suit.jpg" },
    { name: "Sandra", role: "Manager", favourite: "Matcha latte", tilt: 2, img: "/images/team/cute-korean-barista-girl-pouring-coffee-prepare-filter-batch-brew-pour-working-cafe.jpg" },
    { name: "Jackson", role: "Senior barista", favourite: "Cappuccino", tilt: -1.5, img: "/images/team/small-business-owner-drinking-coffee.jpg" },
    { name: "Michelle", role: "Barista and shop", favourite: "Chamomile tea", tilt: 2.5, img: "/images/team/smiley-business-woman-working-cashier.jpg" },
]


function Cup() {
    return (
        <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
            <path d="M9 3c-1.5 1.5 1.5 2.5 0 4M13 3c-1.5 1.5 1.5 2.5 0 4" />
            <path d="M4 10h13v3a6.5 6.5 0 0 1-13 0v-3Z" fill="currentColor" fillOpacity="0.15" />
            <path d="M17 11.5h1.5a2.5 2.5 0 0 1 0 5H16" />
        </svg>
    )
}

export default function Barista() {
    return (
        <div className="container mt-12 sm:mt-16">
            <h3 className="mb-9 text-center text-2xl text-fg sm:mb-11 sm:text-3xl">The people behind the counter</h3>
            <Stagger gap={0.1} as="ul" className="m-0 mx-auto grid max-w-6xl list-none grid-cols-2 gap-x-4 gap-y-14 p-0 sm:gap-x-8 lg:grid-cols-4">
                {team.map((b, i) => (
                    <Item as="li" key={b.name} y={18} className="flex flex-col items-center text-center">
                        <figure className="polaroid relative m-0 w-full max-w-[14rem]" style={{ "--tilt": `${b.tilt}deg` } as React.CSSProperties}>
                            <span aria-hidden className={`tape tape-sm -top-3.5 left-1/2 -translate-x-1/2 ${i % 2 ? "rotate-3" : "-rotate-3"}`} />
                            <div className="no-tint relative aspect-[4/5] w-full overflow-hidden bg-soft">
                                {b.img
                                    ? <Image src={b.img} alt={`${b.name}, ${b.role}`} width={416} height={520} className="no-tint size-full object-cover" />
                                    : <Portrait index={i} label={`${b.name}, ${b.role}`} className="size-full" />}
                            </div>
                            <figcaption className="pt-3">
                                <span className="script block text-[1.65rem] leading-none text-[#14295a]">{b.name}</span>
                                <span className="mt-1.5 block text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[#14295a]/60">{b.role}</span>
                            </figcaption>
                        </figure>
                        <p className="m-0 mt-5 flex flex-col items-center gap-0.5 text-sm text-fg sm:flex-row sm:gap-1.5">
                            <span className="flex items-center gap-1.5 text-muted"><span className="text-[var(--green-text)]"><Cup /></span>Favourite</span>
                            <span>{b.favourite}</span>
                        </p>
                    </Item>
                ))}
            </Stagger>
        </div>
    )
}
