import Image from "next/image"

export default function ProductImage({ src, name }: { src: string; name: string }) {
    if (!src) return <div className="aspect-[4/5] w-full rounded-2xl bg-soft sm:aspect-square" />

    return (
        <div className="photo relative aspect-[4/5] w-full !rounded-2xl sm:aspect-square">
            <Image src={src} alt={name} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="no-tint object-cover" />
        </div>
    )
}