type Tone = "green" | "blue" | "red" | "gray"

const tones: Record<Tone, string> = {
    green: "bg-[var(--green)]/15 text-[var(--green-text)]",
    blue: "bg-brown/12 text-link",
    red: "bg-berry/12 text-berry",
    gray: "bg-soft text-muted",
}
const map: [RegExp, Tone][] = [
    [/(unpaid|not paid|out of stock|unavailable)/i, "red"],
    [/(in stock|available)/i, "green"],
    [/(confirm|done|complete|deliver|paid|success|approved|active|answered)/i, "green"],
    [/(cancel|reject|fail|declin|refund|blocked)/i, "red"],
    [/(pend|wait|process|ship|new|open|unread)/i, "blue"],
]

export default function Badge({ value }: { value?: string | null }) {
    if (!value) return <span className="text-muted">-</span>
    const tone: Tone = map.find(([re]) => re.test(String(value)))?.[1] ?? "gray"
    return <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium capitalize ${tones[tone]}`}>{value}</span>
}
