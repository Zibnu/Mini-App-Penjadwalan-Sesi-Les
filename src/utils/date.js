export function formatDateKey(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

export function isSameDay(a, b) {
    return formatDateKey(a) === formatDateKey(b)
}

export function addDays(date, amount) {
    const result = new Date(date)
    result.setDate(result.getDate() + amount)

    return result
}

export function stripTime(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function parseLocalDate(dateStr) {
    if (!dateStr) return null
    if (dateStr instanceof Date) return dateStr
    const [year, month, day] = dateStr.split("-").map(Number)
    return new Date(year, month - 1, day)
}

const INDO_DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
const INDO_MONTHS = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
]

export function getDayName(dateInput) {
    const d = parseLocalDate(dateInput)
    if (!d) return ""
    return INDO_DAYS[d.getDay()]
}

export function formatDateIndo(dateInput, includeDay = false) {
    const d = parseLocalDate(dateInput)
    if (!d) return ""
    const day = d.getDate()
    const monthName = INDO_MONTHS[d.getMonth()]
    const year = d.getFullYear()
    const formatted = `${day} ${monthName} ${year}`
    return includeDay ? `${INDO_DAYS[d.getDay()]}, ${formatted}` : formatted
}