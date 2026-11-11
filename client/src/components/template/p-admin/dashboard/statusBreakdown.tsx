import type { StatusCount } from "@/types/dashboard"

const TONE: Record<string, string> = {
    pending: "bg-brown/40",
    paid: "bg-brown/70",
    processing: "bg-brown/70",
    shipped: "bg-brown",
    delivered: "bg-[var(--green)]",
    canceled: "bg-berry",
}

export default function StatusBreakdown({ data }: { data: StatusCount[] }) {
    const total = data.reduce((n, d) => n + d.count, 0)
    if (!total) return <p className="m-0 py-10 text-center text-sm text-muted">No orders yet.</p>

    return (
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {data.map((d) => (
                <li key={d.status}>
                    <div className="mb-1 flex justify-between text-sm">
                        <span className="capitalize text-fg">{d.status}</span>
                        <span className="text-muted">{d.count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-soft">
                        <div className={`h-full rounded-full ${TONE[d.status] ?? "bg-brown"}`} style={{ width: `${(d.count / total) * 100}%` }} />
                    </div>
                </li>
            ))}
        </ul>
    )
}
