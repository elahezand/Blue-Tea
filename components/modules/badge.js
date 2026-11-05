/* Small status pill. Colour follows the meaning of the word: done = green, waiting = blue, cancelled = red. */
const tones = {
    green: "bg-[var(--green)]/15 text-[var(--green-text)]",
    blue: "bg-brown/12 text-link",
    red: "bg-berry/12 text-berry",
    gray: "bg-soft text-muted",
}
const map = [
    [/(unpaid|not paid|out of stock|unavailable)/i, "red"],
    [/(in stock|available)/i, "green"],
    [/(confirm|done|complete|deliver|paid|success|approved|active|answered)/i, "green"],
    [/(cancel|reject|fail|declin|refund|blocked)/i, "red"],
    [/(pend|wait|process|ship|new|open|unread)/i, "blue"],
]

export default function Badge({ value }) {
    if (!value) return <span className="text-muted">-</span>
    const tone = (map.find(([re]) => re.test(String(value))) || [null, "gray"])[1]
    return <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium capitalize ${tones[tone]}`}>{value}</span>
}
