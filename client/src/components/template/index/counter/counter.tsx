"use client"

import { motion, useReducedMotion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { MdArrowForward } from "react-icons/md"
import { SectionHeader } from "@/components/modules/motion"

export default function Counter() {
    const reduceMotion = useReducedMotion()

    return (
        <section className="!py-10 lg:!py-16" aria-labelledby="counter-title">
            <div className="relative isolate flex min-h-[25rem] items-end overflow-hidden bg-[var(--navy)] py-6 sm:py-10 lg:min-h-[clamp(25rem,44vw,40rem)] lg:py-12">
                <motion.div
                    className="counter-image absolute inset-0 -z-20"
                    initial={reduceMotion ? false : { scale: 1.12 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: reduceMotion ? 0 : 1.8, ease: "easeOut" }}
                >
                    <Image
                        src="/images/blue-tea-behind-the-counter.webp"
                        alt="Behind the counter at Blue Tea"
                        fill
                        sizes="100vw"
                        className="no-tint object-cover"
                    />
                    <Image
                        src="/images/blue-tea-behind-the-counter-winter.webp"
                        alt=""
                        fill
                        sizes="100vw"
                        className="christmas-photo no-tint object-cover"
                    />
                    <span aria-hidden="true" className="counter-steam">
                        <span />
                        <span />
                        <span />
                    </span>
                </motion.div>
                <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-[#091a30] via-[#091a30]/45 to-transparent" />
                <div className="container flex w-full flex-wrap items-end justify-between gap-x-8 gap-y-5 text-[var(--cream)] [--head:var(--cream)] [--script:var(--cream)]">
                    <div>
                        <SectionHeader titleId="counter-title" title="Behind the counter" align="start" animated={false} className="mb-3" />
                        <p className="mb-5 max-w-md text-sm leading-relaxed sm:text-base">From the first brew to the last cup, there’s always a seat for you at Blue Tea.</p>
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                            <Link href="#reservation" className="btn btn-primary min-h-11">
                                Book a table <MdArrowForward aria-hidden className="size-4" />
                            </Link>
                            <Link href="/about" className="inline-flex min-h-11 items-center underline underline-offset-4">Meet Blue Tea</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
