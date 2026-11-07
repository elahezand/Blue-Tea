import type { ReactNode } from 'react'

/* Admin table: soft header, thin row dividers, hover highlight. Pass <thead> and <tbody> as children. */
interface TableProps {
    children: ReactNode
    title?: string
    toolbar?: ReactNode
}

export default function Table({ children, title, toolbar }: TableProps) {
    return (
        <section className="w-full !p-0">
            {title && <h2 className="mb-3 text-xl font-semibold text-fg">{title}</h2>}
            {toolbar && <div className="mb-4">{toolbar}</div>}
            <div className="overflow-hidden rounded-2xl border border-solid border-line bg-surface">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm text-fg [&_:is(th,td)]:px-4 [&_:is(th,td)]:py-3 [&_:is(th,td)]:text-start [&_:is(th,td)]:align-middle [&_td]:max-w-[260px] [&_td]:truncate [&_th]:whitespace-nowrap [&_th]:bg-soft/70 [&_th]:text-xs [&_th]:font-semibold [&_th]:text-muted [&_tbody_tr]:border-t [&_tbody_tr]:border-line [&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-soft/50 [&_td.number]:w-12 [&_td.number]:text-muted">
                        {children}
                    </table>
                </div>
            </div>
        </section>
    )
}
