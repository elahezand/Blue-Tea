/* Placeholder shapes shown while a server page loads. They match the real layout, so nothing jumps. */
const bar = "animate-pulse rounded-full bg-soft"

export function TableSkeleton({ rows = 6, toolbar = true }) {
    return (
        <div role="status" aria-live="polite" aria-busy="true">
            <span className="sr-only">Loading</span>
            <div className={`${bar} mb-3 h-6 w-44`} />
            {toolbar && <div className="admin-card mb-4 flex flex-wrap gap-3 p-4"><div className={`${bar} h-11 min-w-[15rem] flex-1`} /><div className={`${bar} h-10 w-40`} /><div className={`${bar} h-10 w-40`} /></div>}
            <div className="overflow-hidden rounded-2xl border border-solid border-line bg-surface">
                <div className="h-11 bg-soft/70" />
                {Array.from({ length: rows }, (_, i) => (
                    <div key={i} className="flex items-center gap-4 border-t border-line px-4 py-3.5">
                        <div className="size-9 shrink-0 animate-pulse rounded-full bg-soft" />
                        <div className="flex-1 space-y-2"><div className={`${bar} h-3.5 w-1/3`} /><div className={`${bar} h-3 w-1/2 opacity-60`} /></div>
                        <div className={`${bar} hidden h-6 w-20 sm:block`} />
                        <div className={`${bar} h-8 w-24`} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export function CardListSkeleton({ rows = 3 }) {
    return (
        <div role="status" aria-live="polite" aria-busy="true" className="space-y-4">
            <span className="sr-only">Loading</span>
            <div className="flex gap-2">{[0, 1, 2].map((i) => <div key={i} className={`${bar} h-9 w-24`} />)}</div>
            {Array.from({ length: rows }, (_, i) => (
                <div key={i} className="rounded-3xl border-2 border-dashed border-line bg-surface p-5">
                    <div className={`${bar} mb-3 h-4 w-40`} />
                    <div className={`${bar} mb-2 h-3.5 w-full`} />
                    <div className={`${bar} h-3.5 w-2/3`} />
                </div>
            ))}
        </div>
    )
}
