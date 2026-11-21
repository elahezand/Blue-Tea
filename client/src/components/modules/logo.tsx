interface LogoProps {
    size?: number
    light?: boolean
    withText?: boolean
    className?: string
    text?:boolean
}

const GREEN = "#3cc46a"
const GREEN_DARK = "#2ea85a"
const CREAM = "#f6efe2"

export default function Logo({ size = 32, light = false, withText = true, className = "" }: LogoProps) {
    return (
        <span className={`inline-flex items-center ${className}`} style={{ gap: size * 0.3 }}>
            <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden className="shrink-0">
                <circle cx="32" cy="32" r="29.5" fill="#14295a" stroke={light ? CREAM : "#ffffff"} strokeWidth="3" />
                <path d="M27 13.5c-2.5 2.5 2.5 4.5 0 7.5M35 12.5c-2.5 2.5 2.5 4.5 0 7.5" fill="none" stroke={GREEN} strokeWidth="2.6" strokeLinecap="round" />
                <path d="M18 27h24v5.5a12 12 0 0 1-24 0V27Z" fill={CREAM} />
                <path d="M42 29.5h2.5a4.75 4.75 0 0 1 0 9.5H41" fill="none" stroke={CREAM} strokeWidth="3" strokeLinecap="round" />
                <path d="M16 49h28" stroke={CREAM} strokeWidth="3" strokeLinecap="round" />
            </svg>
            {withText && (
                <span className="script whitespace-nowrap leading-none"
                    style={{ fontSize: size * 0.85, color: light ? CREAM : "var(--navy)" }}>
                    Blue <span style={{ color: light ? GREEN : GREEN_DARK }}>Tea</span>
                </span>
            )}
        </span>
    )
}