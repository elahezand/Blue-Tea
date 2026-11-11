import Image from "next/image"

interface UserAvatarProps {
    name?: string
    src?: string
    size?: number
    className?: string
}

export default function UserAvatar({ name, src, size = 40, className = "" }: UserAvatarProps) {
    if (src) return <Image src={src} width={size} height={size} alt="" className={`shrink-0 rounded-full object-cover ${className}`} style={{ width: size, height: size }} />
    return (
        <span aria-hidden className={`flex shrink-0 items-center justify-center rounded-full bg-soft font-display text-link ${className}`} style={{ width: size, height: size, fontSize: size * 0.42 }}>
            {(name || "?").trim().charAt(0).toUpperCase()}
        </span>
    )
}
