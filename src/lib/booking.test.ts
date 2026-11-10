import { describe, expect, it } from 'vitest'
import {
  isRoomAvailable,
  nightsBetween,
  occupancyPercent,
  quoteStay,
  rangesOverlap,
} from '@/lib/booking'

const room = { precioNoche: 150_000, maxPersonas: 4, today: '2026-11-10' }

describe('cálculo de estancia', () => {
  it('cuenta noches de calendario y multiplica la tarifa', () => {
    expect(nightsBetween('2026-12-01', '2026-12-04')).toBe(3)
    const quote = quoteStay({
      ...room,
      checkIn: '2026-12-01',
      checkOut: '2026-12-04',
      guests: 2,
    })
    expect(quote).toEqual({ ok: true, nights: 3, total: 450_000 })
  })

  it('rechaza llegada pasada, salida el mismo día y exceso de personas', () => {
    expect(
      quoteStay({ ...room, checkIn: '2026-11-01', checkOut: '2026-11-03', guests: 2 }).ok,
    ).toBe(false)
    expect(
      quoteStay({ ...room, checkIn: '2026-12-01', checkOut: '2026-12-01', guests: 2 }).ok,
    ).toBe(false)
    expect(
      quoteStay({ ...room, checkIn: '2026-12-01', checkOut: '2026-12-03', guests: 5 }),
    ).toMatchObject({ ok: false, error: 'capacidad' })
  })
})

describe('disponibilidad', () => {
  const existing = [
    {
      habitacionId: '1',
      fechaInicio: '2026-12-01',
      fechaFin: '2026-12-05',
      estado: 'confirmada',
    },
  ]

  it('trata la salida como libre y conserva una reserva cancelada fuera del bloqueo', () => {
    expect(rangesOverlap('2026-12-05', '2026-12-07', '2026-12-01', '2026-12-05')).toBe(false)
    expect(isRoomAvailable(existing, '1', '2026-12-05', '2026-12-07')).toBe(true)
    expect(isRoomAvailable(existing, '1', '2026-12-04', '2026-12-06')).toBe(false)
    expect(
      isRoomAvailable([{ ...existing[0], estado: 'cancelada' }], '1', '2026-12-02', '2026-12-03'),
    ).toBe(true)
  })

  it('calcula la ocupación del mes solo con noches confirmadas', () => {
    const percent = occupancyPercent(
      1,
      [
        ...existing,
        {
          habitacionId: '1',
          fechaInicio: '2026-12-10',
          fechaFin: '2026-12-12',
          estado: 'cancelada',
        },
      ],
      2026,
      11,
    )
    expect(percent).toBe(Math.round((4 / 31) * 100))
  })
})
