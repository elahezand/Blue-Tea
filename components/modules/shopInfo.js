export const SHOP = {
    name: "Blue Tea",
    address: "Bandra West, Mumbai, Maharashtra 400050, India",
    phone: "+65 305 2409 671",
    phoneHref: "tel:+653052409671",
    email: "hello@barista.co",
    hours: [
        { days: "Monday – Friday", time: "9:00 – 18:00" },
        { days: "Saturday", time: "11:00 – 16:30" },
        { days: "Sunday", time: "Closed" },
    ],
}

// 0 = Sunday. Hours in 24h decimal, null = closed.
const SCHEDULE = { 0: null, 1: [9, 18], 2: [9, 18], 3: [9, 18], 4: [9, 18], 5: [9, 18], 6: [11, 16.5] }

export function openStatus(date = new Date()) {
    const h = date.getHours() + date.getMinutes() / 60
    const today = SCHEDULE[date.getDay()]
    const fmt = (n) => `${Math.floor(n)}:${String(Math.round((n % 1) * 60)).padStart(2, "0")}`
    if (today && h >= today[0] && h < today[1]) return { open: true, text: `Open now, until ${fmt(today[1])}` }
    if (today && h < today[0]) return { open: false, text: `Opens today at ${fmt(today[0])}` }
    for (let i = 1; i <= 7; i++) {
        const d = (date.getDay() + i) % 7
        if (SCHEDULE[d]) return { open: false, text: `Closed, opens ${i === 1 ? "tomorrow" : ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][d]} at ${fmt(SCHEDULE[d][0])}` }
    }
    return { open: false, text: "Closed" }
}
