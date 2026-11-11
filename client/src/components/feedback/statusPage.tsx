import type { AriaRole, ReactNode } from "react"

function Seal({ size = 96, tilt = 0 }: { size?: number; tilt?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" style={{ transform: `rotate(${tilt}deg)` }} className="shrink-0">
            <circle cx="24" cy="24" r="24" fill="var(--logo, var(--accent))" />
            <path className="loader-steam" d="M19 22c-3-3 3-5 0-9" stroke="#6fbf8a" strokeWidth="2.2" strokeLinecap="round" />
            <path className="loader-steam loader-steam-2" d="M28 22c-3-3 3-5 0-9" stroke="#6fbf8a" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M13 26h22v1.5A11 11 0 0 1 24 38.5 11 11 0 0 1 13 27.5V26Z" fill="#fff" />
            <path d="M35 28.5h1.5a3 3 0 0 1 0 6H33" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <rect x="15" y="40.5" width="18" height="2" rx="1" fill="#fff" opacity=".85" />
        </svg>
    )
}

export const btnPrimary = "classic !h-11 !px-8 !text-sm"
export const btnGhost = "inline-flex h-11 cursor-pointer items-center rounded-full border border-solid border-line bg-surface px-8 text-sm font-medium text-fg transition-colors hover:bg-soft"

interface StatusPageProps {
    code?: string
    script: string
    title: string
    text: ReactNode
    children?: ReactNode
    role?: AriaRole
}

export default function StatusPage({ code, script, title, text, children, role }: StatusPageProps) {
    const digit = "font-display text-7xl leading-none sm:text-8xl"
    return (
        <div className="container flex min-h-[65vh] flex-col items-center justify-center py-20 text-center" role={role}>
            {code ? (
                <div aria-label={code} className="mb-6 flex items-center gap-3 sm:gap-5" style={{ color: "var(--head)" }}>
                    <span className={digit} aria-hidden>{code[0]}</span>
                    <Seal size={88} />
                    <span className={digit} aria-hidden>{code[code.length - 1]}</span>
                </div>
            ) : (
                <div className="mb-6"><Seal size={96} tilt={-14} /></div>
            )}
            <p className="script m-0 text-3xl text-[var(--green)]">{script}</p>
            <h1 className="mb-3 mt-1 text-3xl md:text-4xl" style={{ color: "var(--head)" }}>{title}</h1>
            <p className="mb-8 max-w-md text-muted">{text}</p>
            {children}
        </div>
    )
}

export function Actions({ children }: { children: ReactNode }) {
    return <div className="flex flex-wrap justify-center gap-3">{children}</div>
}
