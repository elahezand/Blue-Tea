import type { ReactNode } from "react"
import Link from "next/link"

interface EmptyStateProps {
    icon?: ReactNode
    title: string
    text?: string
    href?: string
    action?: string
}

export default function EmptyState({ icon, title, text, href, action }: EmptyStateProps) {
    return (
        <div className="mx-auto flex max-w-sm flex-col items-center rounded-[2rem] bg-soft/70 px-6 py-12 text-center">
            {icon && <span aria-hidden className="mb-4 flex size-14 items-center justify-center rounded-full bg-surface text-3xl text-link shadow-sm">{icon}</span>}
            <h2 className="mb-2 text-2xl text-fg">{title}</h2>
            {text && <p className="mb-6 text-sm text-muted">{text}</p>}
            {href && <Link href={href} className="btn-organic bg-brown px-7 py-2.5 text-sm font-medium !text-white">{action}</Link>}
        </div>
    )
}
