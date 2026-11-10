export type QuoteError = 'fecha-pasada' | 'rango-invalido' | 'capacidad' | 'huespedes'

export type Quote = { ok: true; nights: number; total: number } | { ok: false; error: QuoteError }

const DAY = 86_400_000

export function parseISODate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return new Date(Number.NaN)
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
}

export function toISODate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function todayISO(date = new Date()) {
  return toISODate(date)
}

export function nightsBetween(start: string, end: string) {
  const diff = parseISODate(end).getTime() - parseISODate(start).getTime()
  if (!Number.isFinite(diff)) return 0
  return Math.round(diff / DAY)
}

export function quoteStay(input: {
  checkIn: string
  checkOut: string
  guests: number
  precioNoche: number
  maxPersonas: number
  today: string
}): Quote {
  if (input.checkIn < input.today) return { ok: false, error: 'fecha-pasada' }
  const nights = nightsBetween(input.checkIn, input.checkOut)
  if (nights <= 0) return { ok: false, error: 'rango-invalido' }
  if (!Number.isInteger(input.guests) || input.guests < 1) return { ok: false, error: 'huespedes' }
  if (input.guests > input.maxPersonas) return { ok: false, error: 'capacidad' }
  return { ok: true, nights, total: nights * input.precioNoche }
}

export function quoteMessage(error: QuoteError) {
  switch (error) {
    case 'fecha-pasada':
      return 'La llegada tiene que ser hoy o un día posterior.'
    case 'rango-invalido':
      return 'La salida tiene que ser posterior a la llegada.'
    case 'capacidad':
      return 'Esta habitación no admite tantas personas.'
    case 'huespedes':
      return 'Indica al menos una persona.'
  }
}

export type Stay = {
  habitacionId: string
  fechaInicio: string
  fechaFin: string
  estado: string
}

/** Intervalo semiabierto: la mañana de la salida queda libre para el siguiente huésped. */
export function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  return aStart < bEnd && bStart < aEnd
}

export function isRoomAvailable(
  bookings: Stay[],
  roomId: string,
  checkIn: string,
  checkOut: string,
) {
  return !bookings.some(
    (booking) =>
      booking.habitacionId === roomId &&
      booking.estado !== 'cancelada' &&
      rangesOverlap(checkIn, checkOut, booking.fechaInicio, booking.fechaFin),
  )
}

export function occupancyPercent(
  roomCount: number,
  bookings: Stay[],
  year: number,
  monthIndex: number,
) {
  if (roomCount <= 0) return 0
  const monthStart = new Date(year, monthIndex, 1)
  const nextMonth = new Date(year, monthIndex + 1, 1)
  const days = Math.round((nextMonth.getTime() - monthStart.getTime()) / DAY)
  let occupied = 0
  for (const booking of bookings) {
    if (booking.estado === 'cancelada') continue
    const start = parseISODate(booking.fechaInicio)
    const end = parseISODate(booking.fechaFin)
    const from = start > monthStart ? start : monthStart
    const to = end < nextMonth ? end : nextMonth
    const nights = Math.round((to.getTime() - from.getTime()) / DAY)
    if (nights > 0) occupied += nights
  }
  return Math.round((occupied / (roomCount * days)) * 100)
}
