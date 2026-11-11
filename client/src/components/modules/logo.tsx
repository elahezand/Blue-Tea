interface LogoProps {
    size?: number
    text?: boolean
    light?: boolean
    className?: string
}

export default function Logo({ size = 36, text = true, light = false, className = "" }: LogoProps) {
    const bg = light ? "#ffffff" : "var(--logo)"
    const cup = light ? "var(--logo)" : "#ffffff"
    return (
        <span className={`inline-flex items-center gap-2 ${className}`}>
            <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" className="shrink-0">
                <circle cx="24" cy="24" r="24" fill={bg} />
                <path d="M19 22c-3-3 3-5 0-9" stroke="#6fbf8a" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                <path d="M28 22c-3-3 3-5 0-9" stroke="#6fbf8a" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                <path d="M13 26h22v1.5A11 11 0 0 1 24 38.5 11 11 0 0 1 13 27.5V26Z" fill={cup} />
                <path d="M35 28.5h1.5a3 3 0 0 1 0 6H33" stroke={cup} strokeWidth="2" strokeLinecap="round" />
                <rect x="15" y="40.5" width="18" height="2" rx="1" fill={cup} opacity=".85" />
            </svg>
            {text && (
                <span className="font-display leading-none font-medium tracking-tight" style={{ fontSize: Math.max(18, size * 0.68) }}>
                    Blue Tea
                </span>
            )}
        </span>
    )
}
