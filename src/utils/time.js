/**
 * Konversi string waktu "HH:MM" atau "HH:MM:SS" ke total menit.
 * Contoh: "08:30" -> 510 menit
 */
export function timeToMinutes(timeStr) {
    if (!timeStr) return 0
    const [hours, minutes] = timeStr.split(":").map(Number)
    return (hours || 0) * 60 + (minutes || 0)
}

/**
 * Konversi total menit ke string format "HH:MM".
 * Contoh: 510 -> "08:30"
 */
export function minutesToTime(totalMinutes) {
    if (isNaN(totalMinutes) || totalMinutes < 0) return ""
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
}

/**
 * Hitung end_time berdasarkan start_time ("HH:MM") dan durasi dalam menit.
 * Contoh: ("14:00", 90) -> "15:30"
 */
export function calculateEndTime(startTime, durationMinutes) {
    if (!startTime || !durationMinutes) return ""
    const startMinutes = timeToMinutes(startTime)
    const endMinutes = startMinutes + Number(durationMinutes)
    return minutesToTime(endMinutes)
}

/**
 * Cek apakah dua interval waktu saling bertabrakan/overlap (exclusive boundary).
 * Interval A: [startA, endA], Interval B: [startB, endB]
 * Overlap jika: startA < endB && endA > startB
 */
export function isTimeOverlap(startA, endA, startB, endB) {
    if (!startA || !endA || !startB || !endB) return false
    const sA = timeToMinutes(startA)
    const eA = timeToMinutes(endA)
    const sB = timeToMinutes(startB)
    const eB = timeToMinutes(endB)

    return sA < eB && eA > sB
}

/**
 * Cek apakah waktu mulai lebih awal dari batas awal jam operasional (default "07:00").
 * Contoh: "06:30" -> true, "07:00" -> false
 */
export function isBeforeOperationalHours(timeStr, limitStr = "07:00") {
    if (!timeStr) return false
    return timeToMinutes(timeStr) < timeToMinutes(limitStr)
}

/**
 * Cek apakah waktu melebihi batas akhir jam operasional (default "20:00").
 * Contoh: "20:30" -> true, "20:00" -> false
 */
export function isExceedingOperationalHours(timeStr, limitStr = "20:00") {
    if (!timeStr) return false
    return timeToMinutes(timeStr) > timeToMinutes(limitStr)
}

/**
 * Cek apakah sesi berada di luar rentang jam operasional ("07:00" s/d "20:00").
 */
export function isOutsideOperationalHours(startTime, endTime, startLimit = "07:00", endLimit = "20:00") {
    if (!startTime) return false
    const startTooEarly = isBeforeOperationalHours(startTime, startLimit)
    const endTooLate = endTime ? isExceedingOperationalHours(endTime, endLimit) : false
    return startTooEarly || endTooLate
}

