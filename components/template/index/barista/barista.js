import React from 'react'
import Image from 'next/image'
import { Portrait } from '@/components/modules/illustrations'
import { SectionHeader, Stagger, Item } from '@/components/modules/motion'

const team = [
    { name: "Steve", role: "Founder", img: "/images/team/portrait-elegant-old-man-wearing-suit.jpg" },
    { name: "Sandra", role: "Manager", img: "/images/team/cute-korean-barista-girl-pouring-coffee-prepare-filter-batch-brew-pour-working-cafe.jpg" },
    { name: "Jackson", role: "Senior barista", img: "/images/team/small-business-owner-drinking-coffee.jpg" },
    { name: "Michelle", role: "Barista and shop", img: "/images/team/smiley-business-woman-working-cashier.jpg" },
]

/* Minimal: four round portraits, a name and a role. Nothing else. */
export default function Barista() {
    return (
        <section className="!py-14 lg:!py-20">
            <div className="container">
                <SectionHeader script="Say hello" title="The people behind the counter" className="mb-10" />
                <Stagger gap={0.08} as="ul" className="m-0 mx-auto grid max-w-5xl list-none grid-cols-2 gap-x-4 gap-y-10 p-0 sm:gap-x-8 lg:grid-cols-4">
                    {team.map((b, i) => (
                        <Item as="li" key={b.name} y={14} className="flex flex-col items-center text-center">
                            <div className="no-tint mb-4 size-36 overflow-hidden rounded-full bg-soft ring-1 ring-[var(--line)] ring-offset-4 ring-offset-[var(--bg)] sm:size-44 lg:size-52">
                                {b.img
                                    ? <Image src={b.img} alt={`${b.name}, ${b.role}`} width={416} height={416} className="size-full object-cover" />
                                    : <Portrait index={i} label={`${b.name}, ${b.role}`} className="size-full" />}
                            </div>
                            <h3 className="m-0 font-display text-xl text-fg">{b.name}</h3>
                            <p className="m-0 text-base text-muted">{b.role}</p>
                        </Item>
                    ))}
                </Stagger>
            </div>
        </section>
    )
}
