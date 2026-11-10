"use client"
import { useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { MdChevronLeft, MdChevronRight } from "react-icons/md"

export default function ProductGallery({ images, name = "Product" }: { images: string | string[]; name?: string }) {
    const list = (Array.isArray(images) ? images : [images]).filter(Boolean)
    const [index, setIndex] = useState(0)
    const reduce = useReducedMotion()
    if (!list.length) return <div className="aspect-square w-full rounded-xl bg-soft" />

    return (
        <div>
            <div className="photo relative aspect-[4/5] w-full !rounded-2xl sm:aspect-square">
                <AnimatePresence mode="wait">
                    <motion.div key={index} className="absolute inset-0"
                        initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={reduce ? { opacity: 0 } : { opacity: 0 }}
                        transition={{ duration: 0.25 }}>
                        <Image src={list[index]} alt={index === 0 ? name : `${name}, view ${index + 1}`}
                            fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="no-tint object-cover" />
                    </motion.div>
                </AnimatePresence>
                {list.length > 1 && ["prev", "next"].map((d) => (
                    <button key={d} type="button" aria-label={d === "prev" ? "Previous image" : "Next image"}
                        onClick={() => setIndex((i) => (d === "prev" ? (i - 1 + list.length) % list.length : (i + 1) % list.length))}
                        className={`absolute top-1/2 z-10 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-none bg-surface/85 text-2xl text-fg shadow-md backdrop-blur transition hover:bg-surface ${d === "prev" ? "left-3" : "right-3"}`}>
                        {d === "prev" ? <MdChevronLeft /> : <MdChevronRight />}
                    </button>
                ))}
            </div>
            {list.length > 1 && (
                <div className="mt-3 flex gap-3" role="group" aria-label="Product images">
                    {list.map((src, i) => (
                        <button key={i} type="button" onClick={() => setIndex(i)} aria-label={`Show image ${i + 1}`} aria-pressed={i === index}
                            className={`relative size-16 shrink-0 cursor-pointer overflow-hidden rounded-full border bg-soft p-0 transition sm:size-20 ${i === index ? "border-brown ring-2 ring-brown/25" : "border-line opacity-70 hover:opacity-100"}`}>
                            <Image src={src} alt="" fill sizes="80px" className="no-tint object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}