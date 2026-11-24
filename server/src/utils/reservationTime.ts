import "dotenv/config"

export const RESERVATION_TIME_ZONE = process.env.RESERVATION_TIME_ZONE || "UTC"
export const RESERVATION_CLOCK = /^([01]\d|2[0-3]):[0-5]\d$/

const clock = new Intl.DateTimeFormat("en-CA", {
    timeZone: RESERVATION_TIME_ZONE,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
})

export const isReservationDate = (date: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false
    const day = new Date(`${date}T00:00:00.000Z`)
    return Number.isFinite(day.getTime()) && day.toISOString().slice(0, 10) === date
}

export const reservationInstant = (date: string, time: string) => {
    if (!isReservationDate(date) || !RESERVATION_CLOCK.test(time)) return null
    const wallTime = `${date}T${time}`
    const utcGuess = Date.parse(`${wallTime}Z`)
    let instant = utcGuess
    for (let attempt = 0; attempt < 3; attempt++) {
        const parts = Object.fromEntries(clock.formatToParts(instant).map(({ type, value }) => [type, value]))
        const local = `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`
        if (local === wallTime) return new Date(instant)
        instant += utcGuess - Date.parse(`${local}Z`)
    }
    return null
}

export const isReservationSlot = (date: string, time: string) => {
    const weekday = new Date(`${date}T00:00:00.000Z`).getUTCDay()
    const [open, close] = weekday === 6 ? ["11:00", "16:30"] : ["09:00", "18:00"]
    return weekday >= 1 && weekday <= 6 && time >= open && time < close && /:(00|30)$/.test(time)
}
