import { formatPrice } from "@/utils/helper"
import type { DailySales } from "@/types/dashboard"

const label = (date: string) => new Date(date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric" })

export default function SalesChart({ data }: { data: DailySales[] }) {
    if (!data.length) return <p className="m-0 py-10 text-center text-sm text-muted">No sales in this period yet.</p>
    const max = Math.max(...data.map((d) => d.total), 1)

    return (
        <figure className="m-0">
            <div className="flex h-56 items-end gap-2 border-b border-line pb-px" role="img" aria-label="Sales per day">
                {data.map((d) => (
                    <div key={d.date} className="group relative flex h-full flex-1 flex-col justify-end">
                        <span className="pointer-events-none absolute -top-1 left-1/2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-[var(--navy)] px-2 py-1 text-xs text-[var(--cream)] opacity-0 transition-opacity group-hover:opacity-100">
                            {formatPrice(d.total)} · {d.orders} {d.orders === 1 ? "order" : "orders"}
                        </span>
                        <div className="rounded-t-lg bg-brown/80 transition-colors group-hover:bg-brown" style={{ height: `${Math.max((d.total / max) * 100, d.total ? 2 : 0)}%` }} />
                    </div>
                ))}
            </div>
            <div className="mt-2 flex gap-2">
                {data.map((d) => <span key={d.date} className="flex-1 text-center text-xs text-muted">{label(d.date)}</span>)}
            </div>
            <figcaption className="sr-only">
                {data.map((d) => `${label(d.date)}: ${formatPrice(d.total)}`).join(", ")}
            </figcaption>
        </figure>
    )
}
