import Image from "next/image"

export default function ProductImage({ src, name }: { src: string; name: string }) {
    return (
        <div className="polaroid polaroid-static relative mt-2 self-start">
            {src && (
                <>
                    <span aria-hidden className="tape tape-sm -top-2 left-1 z-10 -rotate-[28deg]" />
                    <span aria-hidden className="tape tape-sm -bottom-2 right-2 z-10 -rotate-[28deg]" />
                </>
            )}
            <div className="relative aspect-[5/4] w-full overflow-hidden bg-soft lg:aspect-square">
                {src && (
                    <Image
                        src={src}
                        alt={name}
                        fill
                        priority
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="no-tint object-cover"
                    />
                )}
            </div>
        </div>
    )
}
