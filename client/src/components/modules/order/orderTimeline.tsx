import { MdCheck } from "react-icons/md"
import type { Order } from "@/types/order"

const when = (d?: string) => (d ? new Date(d).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "")

export default function OrderTimeline({ order }: { order: Pick<Order, "createdAt" | "paidAt" | "shippedAt" | "deliveredAt" | "canceledAt" | "paymentMethod"> }) {
    const steps = order.canceledAt
        ? [{ label: "Placed", at: order.createdAt }, { label: "Canceled", at: order.canceledAt }]
        : [
            { label: "Placed", at: order.createdAt },
            { label: order.paymentMethod === "cash" ? "Pay on delivery" : "Paid", at: order.paymentMethod === "cash" ? order.createdAt : order.paidAt },
            { label: "Shipped", at: order.shippedAt },
            { label: "Delivered", at: order.deliveredAt },
        ]

    return (
        <ol className="m-0 flex list-none flex-col gap-0 p-0 sm:flex-row">
            {steps.map((s, i) => {
                const done = !!s.at
                const canceled = s.label === "Canceled"
                return (
                    <li key={s.label} className="flex flex-1 items-start gap-3 sm:flex-col sm:items-center sm:text-center">
                        <div className="flex flex-col items-center sm:w-full sm:flex-row">
                            <span className={`hidden h-0.5 flex-1 sm:block ${i === 0 ? "invisible" : done ? "bg-brown" : "bg-line"}`} />
                            <span aria-hidden className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm ${canceled ? "bg-berry text-white" : done ? "bg-brown text-white" : "border-2 border-dashed border-line bg-surface text-muted"}`}>
                                {done ? <MdCheck /> : i + 1}
                            </span>
                            <span className={`hidden h-0.5 flex-1 sm:block ${i === steps.length - 1 ? "invisible" : steps[i + 1]?.at ? "bg-brown" : "bg-line"}`} />
                        </div>
                        <div className="pb-4 sm:px-2 sm:pt-2">
                            <p className={`m-0 text-sm font-medium ${done ? "text-fg" : "text-muted"}`}>{s.label}</p>
                            {s.at && <p className="m-0 text-xs text-muted">{when(s.at)}</p>}
                        </div>
                    </li>
                )
            })}
        </ol>
    )
}
