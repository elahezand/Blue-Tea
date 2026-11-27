"use client"

import { useState } from "react"
import Link from "next/link"
import { MdArrowForward } from "react-icons/md"
import { motion, useReducedMotion } from "framer-motion"
import { SectionHeader } from "@/components/modules/motion"
import TeaPour from "./Teapot"
import type { Product } from "@/types/product"

export interface TeaChoice {
    label: string
    teas: { product: Pick<Product, "_id" | "name">; note: string }[]
}

export default function TeaGuide({ choices }: { choices: TeaChoice[] }) {
    const [selected, setSelected] = useState<string | null>(null)
    const reduce = useReducedMotion()
    const active = choices.find((choice) => choice.label === selected) ?? choices[0]

    if (!active) return null

    return (
        <section
            aria-labelledby="home-tea-guide-title"
            className="bg-[var(--storefront-chrome)] !py-8 text-[var(--cream)] [--head:var(--cream)] [--script:var(--script-on-navy)] lg:!py-10"
        >
            <div className="container">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.5fr)] lg:items-center lg:gap-8">
                    <div className="min-w-0">
                        <div className="mb-4 flex items-center gap-3">
                            <TeaPour/>
                            <SectionHeader
                                titleId="home-tea-guide-title"
                                script="For your next brew"
                                title="Find your kind of tea"
                                align="start"
                                className="m-0"
                                animated={false}
                            />
                        </div>

                        <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a flavor">
                            {choices.map(({ label }) => (
                                <button
                                    key={label}
                                    type="button"
                                    aria-pressed={active.label === label}
                                    onClick={() => setSelected(label)}
                                    className="btn btn-outline-light !min-h-10 !px-3 !text-xs aria-pressed:!border-[var(--cream)] aria-pressed:!bg-[var(--cream)] aria-pressed:!text-[var(--storefront-chrome)]"
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <ul aria-live="polite" className="m-0 list-none divide-y divide-white/20 border-y border-white/20 p-0">
                        {active.teas.map(({ product, note }, index) => (
                            <motion.li
                                key={product._id}
                                initial={reduce ? false : { opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: index * 0.06 }}
                                className="min-w-0"
                            >
                                <Link
                                    href={`/products/${product._id}`}
                                    className="group flex min-h-16 items-center justify-between gap-4 py-3"
                                >
                                    <div className="min-w-0">
                                        <h3 className="m-0 text-lg text-[var(--cream)] transition-colors group-hover:text-[var(--script-on-navy)] sm:text-xl">
                                            {product.name}
                                        </h3>
                                        {note && <p className="m-0 mt-1 text-sm leading-relaxed text-[var(--cream)]/80">{note}</p>}
                                    </div>
                                    <MdArrowForward aria-hidden className="size-4 shrink-0 text-[var(--lamp)]" />
                                </Link>
                            </motion.li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}
