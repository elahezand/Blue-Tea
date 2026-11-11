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

const SCHEDULE: Record<number, [number, number] | null> = { 0: null, 1: [9, 18], 2: [9, 18], 3: [9, 18], 4: [9, 18], 5: [9, 18], 6: [11, 16.5] }

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
