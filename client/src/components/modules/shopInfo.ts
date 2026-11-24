export const SHOP = {
    name: "Blue Tea",
    address: "123 Example Street, Your City, 00000",
    phone: "+1 555 010 0000",
    phoneHref: "tel:+15550100000",
    email: "hello@example.com",
    hours: [
        { days: "Monday – Friday", time: "9:00 – 18:00" },
        { days: "Saturday", time: "11:00 – 16:30" },
        { days: "Sunday", time: "Closed" },
    ],
}

export const SHOP_DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SHOP.address)}`

const SCHEDULE: Record<number, [number, number] | null> = { 0: null, 1: [9, 18], 2: [9, 18], 3: [9, 18], 4: [9, 18], 5: [9, 18], 6: [11, 16.5] }
const formatTime = (hour: number) => `${String(Math.floor(hour)).padStart(2, "0")}:${String(Math.round((hour % 1) * 60)).padStart(2, "0")}`

const reservationClock = new Intl.DateTimeFormat("en-CA", {
    timeZone: process.env.NEXT_PUBLIC_RESERVATION_TIME_ZONE || "UTC",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
})

export function reservationLocalTime(now: Date) {
    const parts = Object.fromEntries(reservationClock.formatToParts(now).map(({ type, value }) => [type, value]))
    return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}` }
}

export function reservationCancellationOpen(
    { startsAt, date, time }: { startsAt?: string; date: string; time: string },
    now: number,
) {
    const cutoff = now + 3 * 60 * 60 * 1000
    if (startsAt) return Date.parse(startsAt) >= cutoff

    const local = reservationLocalTime(new Date(cutoff))
    const bookingTime = `${date}T${time}`
    const cutoffTime = `${local.date}T${local.time}`
    return bookingTime > cutoffTime || (bookingTime === cutoffTime && cutoff % 60_000 === 0)
}

export function reservationSlots(date: string, now: ReturnType<typeof reservationLocalTime>) {
    if (!date || date < now.date) return []
    const hours = SCHEDULE[new Date(`${date}T00:00:00Z`).getUTCDay()]
    if (!hours) return []
    const [open, close] = hours
    return Array.from({ length: (close - open) * 2 }, (_, index) => formatTime(open + index / 2))
        .filter((time) => date !== now.date || time > now.time)
}

export function openStatus(date = new Date()): { open: boolean; text: string } {
    const h = date.getHours() + date.getMinutes() / 60
    const today = SCHEDULE[date.getDay()]
    const fmt = (n: number) => `${Math.floor(n)}:${String(Math.round((n % 1) * 60)).padStart(2, "0")}`
    if (today && h >= today[0] && h < today[1]) return { open: true, text: `Open now, until ${fmt(today[1])}` }
    if (today && h < today[0]) return { open: false, text: `Opens today at ${fmt(today[0])}` }
    for (let i = 1; i <= 7; i++) {
        const d = (date.getDay() + i) % 7
        const next = SCHEDULE[d]
        if (next) return { open: false, text: `Closed, opens ${i === 1 ? "tomorrow" : ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][d]} at ${fmt(next[0])}` }
    }
    return { open: false, text: "Closed" }
}
