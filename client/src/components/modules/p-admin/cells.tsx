import type { ReactNode } from "react"

export const day = (d?: string | number | Date | null): string => (d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "-")

export function Avatar({ name, size = "size-9" }: { name?: string; size?: string }) {
    return <span aria-hidden className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-soft font-medium text-link`}>{(name || "?").trim().charAt(0).toUpperCase()}</span>
}

export function Person({ name, sub }: { name?: string; sub?: string }) {
    return (
        <div className="flex items-center gap-3">
            <Avatar name={name} />
            <span className="min-w-0">
                <span className="block truncate font-medium text-fg">{name || "Unknown"}</span>
                {sub && <span className="block truncate text-xs text-muted">{sub}</span>}
            </span>
        </div>
    )
}

export function Chip({ children, tone = "plain" }: { children: ReactNode; tone?: "plain" | "brand" }) {
    const t = tone === "brand" ? "border-brown/40 bg-brown/10 text-link" : "border-line text-muted"
    return <span className={`inline-flex whitespace-nowrap rounded-full border border-solid px-3 py-0.5 text-xs ${t}`}>{children}</span>
}

const act = "inline-flex h-8 cursor-pointer items-center justify-center gap-1 whitespace-nowrap rounded-full border border-solid px-3 text-xs font-medium transition-colors disabled:cursor-wait disabled:opacity-60"
export const actPrimary = `${act} border-brown bg-brown !text-white hover:brightness-110`
export const actGhost = `${act} border-line bg-surface text-fg hover:border-brown/50 hover:bg-soft`
export const actDanger = `${act} border-line bg-surface text-berry hover:border-berry/50 hover:bg-berry/10`
export const Actions = ({ children }: { children: ReactNode }) => <div className="flex flex-wrap items-center gap-2">{children}</div>
