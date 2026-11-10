import { describe, expect, it } from 'vitest'
import { createMemoryRepository } from '@/lib/api/store'

const guest = { nombre: 'Ana Ruiz', email: 'ana@example.com', telefono: '3001234567' }

describe('repositorio de reservas', () => {
  it('calcula el total en el almacén y bloquea el solape, no la salida', async () => {
    const repo = createMemoryRepository()
    const first = await repo.createBooking({
      habitacionId: '1',
      usuarioId: null,
      huesped: guest,
      fechaInicio: '2026-12-01',
      fechaFin: '2026-12-04',
      personas: 2,
    })
    expect(first.total).toBe(450_000)
    expect(first.noches).toBe(3)

    await expect(
      repo.createBooking({
        habitacionId: '1',
        usuarioId: null,
        huesped: guest,
        fechaInicio: '2026-12-03',
        fechaFin: '2026-12-06',
        personas: 2,
      }),
    ).rejects.toThrow('Habitación no disponible en esas fechas')

    const next = await repo.createBooking({
      habitacionId: '1',
      usuarioId: null,
      huesped: guest,
      fechaInicio: '2026-12-04',
      fechaFin: '2026-12-06',
      personas: 2,
    })
    expect(next.total).toBe(300_000)
  })

  it('impide borrar una habitación con una reserva confirmada', async () => {
    const repo = createMemoryRepository()
    await repo.createBooking({
      habitacionId: '2',
      usuarioId: null,
      huesped: guest,
      fechaInicio: '2026-12-10',
      fechaFin: '2026-12-12',
      personas: 2,
    })
    await expect(repo.deleteRoom('2')).rejects.toThrow(/reservas activas/)
    const bookings = await repo.listBookings()
    await repo.cancelBooking(bookings[0].id)
    await repo.deleteRoom('2')
    const rooms = await repo.listRooms()
    expect(rooms.find((room) => room.id === '2')).toBeUndefined()
  })
})
