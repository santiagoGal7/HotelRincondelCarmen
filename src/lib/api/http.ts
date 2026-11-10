import { isRoomAvailable, quoteStay, todayISO } from '@/lib/booking'
import { createId } from '@/lib/format'
import { cloneSeed } from '@/lib/api/seed'
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  publicUser,
  type Booking,
  type ContactMessage,
  type HotelRepository,
  type NewBooking,
  type NewTicket,
  type Room,
  type Ticket,
  type User,
} from '@/lib/api/types'

type Meta = { adminUser?: string; adminPassword?: string }

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
  if (!response.ok) {
    throw new Error(`No se pudo hablar con la API (${response.status})`)
  }
  if (response.status === 204) return undefined as T
  const text = await response.text()
  if (!text) return undefined as T
  return JSON.parse(text) as T
}

export function createHttpRepository(baseUrl: string): HotelRepository {
  const base = baseUrl.replace(/\/$/, '')

  return {
    listRooms: () => request<Room[]>(`${base}/rooms`),
    async saveRoom(room) {
      const rooms = await request<Room[]>(`${base}/rooms`)
      const exists = rooms.some((item) => item.id === room.id)
      if (exists)
        return request<Room>(`${base}/rooms/${room.id}`, {
          method: 'PUT',
          body: JSON.stringify(room),
        })
      return request<Room>(`${base}/rooms`, { method: 'POST', body: JSON.stringify(room) })
    },
    async deleteRoom(id) {
      const bookings = await request<Booking[]>(`${base}/bookings`)
      if (
        bookings.some((booking) => booking.habitacionId === id && booking.estado !== 'cancelada')
      ) {
        throw new Error('No se puede eliminar: la habitación tiene reservas activas')
      }
      await request(`${base}/rooms/${id}`, { method: 'DELETE' })
    },
    listBookings: () => request<Booking[]>(`${base}/bookings`),
    async createBooking(input: NewBooking) {
      const [rooms, bookings] = await Promise.all([
        request<Room[]>(`${base}/rooms`),
        request<Booking[]>(`${base}/bookings`),
      ])
      const room = rooms.find((item) => item.id === input.habitacionId)
      if (!room) throw new Error('Habitación no encontrada')
      const quote = quoteStay({
        checkIn: input.fechaInicio,
        checkOut: input.fechaFin,
        guests: input.personas,
        precioNoche: room.precioNoche,
        maxPersonas: room.maxPersonas,
        today: todayISO(),
      })
      if (!quote.ok) throw new Error('Revisa las fechas de la reserva')
      if (!isRoomAvailable(bookings, room.id, input.fechaInicio, input.fechaFin)) {
        throw new Error('Habitación no disponible en esas fechas')
      }
      const booking: Booking = {
        id: createId('r'),
        habitacionId: room.id,
        usuarioId: input.usuarioId,
        huesped: input.huesped,
        fechaInicio: input.fechaInicio,
        fechaFin: input.fechaFin,
        personas: input.personas,
        noches: quote.nights,
        total: quote.total,
        estado: 'confirmada',
        notas: input.notas?.trim() ?? '',
        creadaEn: new Date().toISOString(),
      }
      return request<Booking>(`${base}/bookings`, { method: 'POST', body: JSON.stringify(booking) })
    },
    async cancelBooking(id) {
      const booking = await request<Booking>(`${base}/bookings/${id}`)
      return request<Booking>(`${base}/bookings/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...booking, estado: 'cancelada' }),
      })
    },
    async listUsers() {
      const users = await request<User[]>(`${base}/users`)
      return users.map(publicUser)
    },
    async registerUser(input) {
      const users = await request<User[]>(`${base}/users`)
      const email = input.email.trim().toLowerCase()
      if (users.some((user) => user.id === input.id || user.email.toLowerCase() === email)) {
        throw new Error('Usuario ya existe')
      }
      const user = { ...input, email }
      await request(`${base}/users`, { method: 'POST', body: JSON.stringify(user) })
      return publicUser(user)
    },
    async loginUser(id, password) {
      const users = await request<User[]>(`${base}/users`)
      const user = users.find((item) => item.id === id && item.password === password)
      if (!user) throw new Error('Credenciales inválidas')
      return publicUser(user)
    },
    async loginAdmin(username, password) {
      let meta: Meta
      try {
        meta = await request<Meta>(`${base}/meta`)
      } catch {
        meta = {}
      }
      const expectedUser = meta.adminUser || ADMIN_USERNAME
      const expectedPassword = meta.adminPassword || ADMIN_PASSWORD
      if (username !== expectedUser || password !== expectedPassword) {
        throw new Error('Credenciales inválidas')
      }
    },
    listTickets: () => request<Ticket[]>(`${base}/tickets`),
    async createTicket(input: NewTicket) {
      const [users, bookings] = await Promise.all([
        request<User[]>(`${base}/users`),
        request<Booking[]>(`${base}/bookings`),
      ])
      const user = users.find((item) => item.id === input.usuarioId)
      const booking = bookings.find((item) => item.id === input.reservaId)
      if (
        !user ||
        !booking ||
        (booking.usuarioId !== user.id &&
          booking.huesped.email.toLowerCase() !== user.email.toLowerCase())
      ) {
        throw new Error('La reserva no corresponde a este huésped')
      }
      const ticket: Ticket = {
        id: createId('t'),
        ...input,
        estado: 'Pendiente',
        respuesta: '',
        creadaEn: new Date().toISOString(),
      }
      return request<Ticket>(`${base}/tickets`, { method: 'POST', body: JSON.stringify(ticket) })
    },
    async updateTicket(id, patch) {
      const ticket = await request<Ticket>(`${base}/tickets/${id}`)
      return request<Ticket>(`${base}/tickets/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...ticket, ...patch }),
      })
    },
    async deleteTicket(id, usuarioId) {
      const ticket = await request<Ticket>(`${base}/tickets/${id}`)
      if (ticket.usuarioId !== usuarioId) throw new Error('Ticket no encontrado')
      if (ticket.estado !== 'Pendiente') {
        throw new Error('Solo se pueden eliminar tickets en estado Pendiente')
      }
      await request(`${base}/tickets/${id}`, { method: 'DELETE' })
    },
    listMessages: () => request<ContactMessage[]>(`${base}/messages`),
    async createMessage(input) {
      const message = { ...input, id: createId('m'), creadaEn: new Date().toISOString() }
      return request<ContactMessage>(`${base}/messages`, {
        method: 'POST',
        body: JSON.stringify(message),
      })
    },
    async reset() {
      const seed = cloneSeed()
      const [rooms, users, bookings, tickets, messages] = await Promise.all([
        request<Room[]>(`${base}/rooms`),
        request<User[]>(`${base}/users`),
        request<Booking[]>(`${base}/bookings`),
        request<Ticket[]>(`${base}/tickets`),
        request<ContactMessage[]>(`${base}/messages`),
      ])
      await Promise.all([
        ...rooms.map((item) => request(`${base}/rooms/${item.id}`, { method: 'DELETE' })),
        ...users.map((item) => request(`${base}/users/${item.id}`, { method: 'DELETE' })),
        ...bookings.map((item) => request(`${base}/bookings/${item.id}`, { method: 'DELETE' })),
        ...tickets.map((item) => request(`${base}/tickets/${item.id}`, { method: 'DELETE' })),
        ...messages.map((item) => request(`${base}/messages/${item.id}`, { method: 'DELETE' })),
      ])
      await Promise.all(
        seed.rooms.map((room) =>
          request(`${base}/rooms`, { method: 'POST', body: JSON.stringify(room) }),
        ),
      )
    },
  }
}
