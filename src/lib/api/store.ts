import { isRoomAvailable, quoteStay, todayISO } from '@/lib/booking'
import { createId } from '@/lib/format'
import { cloneSeed } from '@/lib/api/seed'
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  publicUser,
  type Booking,
  type HotelRepository,
  type NewBooking,
  type NewMessage,
  type NewTicket,
  type NewUser,
  type Room,
  type RoomType,
  type Store,
  type Ticket,
} from '@/lib/api/types'

export interface KeyValueStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export function memoryStorage(): KeyValueStorage {
  let value: string | null = null
  return {
    getItem: () => value,
    setItem: (_key, next) => {
      value = next
    },
  }
}

const ROOM_TYPES: RoomType[] = ['estandar', 'deluxe', 'suite']

function readStore(storage: KeyValueStorage, key: string): Store {
  const raw = storage.getItem(key)
  if (!raw) {
    const seed = cloneSeed()
    storage.setItem(key, JSON.stringify(seed))
    return seed
  }
  try {
    const parsed = JSON.parse(raw) as Store
    if (!Array.isArray(parsed.rooms) || !Array.isArray(parsed.bookings)) {
      throw new Error('almacén incompleto')
    }
    return parsed
  } catch {
    const seed = cloneSeed()
    storage.setItem(key, JSON.stringify(seed))
    return seed
  }
}

function writeStore(storage: KeyValueStorage, key: string, store: Store) {
  storage.setItem(key, JSON.stringify(store))
}

function assertRoom(store: Store, room: Room) {
  if (!room.nombre.trim() || !room.slug.trim()) throw new Error('Nombre y slug son obligatorios')
  if (!ROOM_TYPES.includes(room.tipo)) throw new Error('El tipo debe ser estándar, deluxe o suite')
  if (room.camas < 1 || room.maxPersonas < 1)
    throw new Error('Camas y cupo tienen que ser al menos 1')
  if (room.precioNoche <= 0) throw new Error('La tarifa por noche tiene que ser mayor que cero')
  if (room.imagenes.length === 0) throw new Error('Elige al menos una imagen')
  const slugTaken = store.rooms.some((item) => item.slug === room.slug && item.id !== room.id)
  if (slugTaken) throw new Error('Ya existe una habitación con ese slug')
}

function owns(booking: Booking, usuarioId: string, email?: string) {
  return booking.usuarioId === usuarioId || (email ? booking.huesped.email === email : false)
}

export function createStoreRepository(storage: KeyValueStorage, key = 'rdc.v1'): HotelRepository {
  const update = <T>(fn: (store: Store) => T): T => {
    const store = readStore(storage, key)
    const result = fn(store)
    writeStore(storage, key, store)
    return result
  }

  return {
    async listRooms() {
      return readStore(storage, key).rooms
    },
    async saveRoom(room) {
      return update((store) => {
        assertRoom(store, room)
        const index = store.rooms.findIndex((item) => item.id === room.id)
        if (index >= 0) store.rooms[index] = room
        else store.rooms.push(room)
        return room
      })
    },
    async deleteRoom(id) {
      update((store) => {
        const active = store.bookings.some(
          (booking) => booking.habitacionId === id && booking.estado !== 'cancelada',
        )
        if (active) throw new Error('No se puede eliminar: la habitación tiene reservas activas')
        store.rooms = store.rooms.filter((room) => room.id !== id)
      })
    },
    async listBookings() {
      return readStore(storage, key).bookings
    },
    async createBooking(input: NewBooking) {
      return update((store) => {
        const room = store.rooms.find((item) => item.id === input.habitacionId)
        if (!room) throw new Error('Habitación no encontrada')
        const quote = quoteStay({
          checkIn: input.fechaInicio,
          checkOut: input.fechaFin,
          guests: input.personas,
          precioNoche: room.precioNoche,
          maxPersonas: room.maxPersonas,
          today: todayISO(),
        })
        if (!quote.ok) {
          throw new Error(
            quote.error === 'capacidad'
              ? 'Esta habitación no admite tantas personas'
              : 'Revisa las fechas de la reserva',
          )
        }
        if (!isRoomAvailable(store.bookings, room.id, input.fechaInicio, input.fechaFin)) {
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
        store.bookings.push(booking)
        return booking
      })
    },
    async cancelBooking(id) {
      return update((store) => {
        const booking = store.bookings.find((item) => item.id === id)
        if (!booking) throw new Error('Reserva no encontrada')
        booking.estado = 'cancelada'
        return booking
      })
    },
    async listUsers() {
      return readStore(storage, key).users.map(publicUser)
    },
    async registerUser(input: NewUser) {
      return update((store) => {
        const email = input.email.trim().toLowerCase()
        if (
          store.users.some((user) => user.id === input.id || user.email.toLowerCase() === email)
        ) {
          throw new Error('Usuario ya existe')
        }
        const user = { ...input, email }
        store.users.push(user)
        return publicUser(user)
      })
    },
    async loginUser(id, password) {
      const user = readStore(storage, key).users.find(
        (item) => item.id === id && item.password === password,
      )
      if (!user) throw new Error('Credenciales inválidas')
      return publicUser(user)
    },
    async loginAdmin(username, password) {
      if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        throw new Error('Credenciales inválidas')
      }
    },
    async listTickets() {
      return readStore(storage, key).tickets
    },
    async createTicket(input: NewTicket) {
      return update((store) => {
        const user = store.users.find((item) => item.id === input.usuarioId)
        const booking = store.bookings.find((item) => item.id === input.reservaId)
        if (!user || !booking || !owns(booking, user.id, user.email)) {
          throw new Error('La reserva no corresponde a este huésped')
        }
        const ticket: Ticket = {
          id: createId('t'),
          ...input,
          estado: 'Pendiente',
          respuesta: '',
          creadaEn: new Date().toISOString(),
        }
        store.tickets.push(ticket)
        return ticket
      })
    },
    async updateTicket(id, patch) {
      return update((store) => {
        const ticket = store.tickets.find((item) => item.id === id)
        if (!ticket) throw new Error('Ticket no encontrado')
        ticket.estado = patch.estado
        ticket.respuesta = patch.respuesta
        return ticket
      })
    },
    async deleteTicket(id, usuarioId) {
      update((store) => {
        const ticket = store.tickets.find((item) => item.id === id && item.usuarioId === usuarioId)
        if (!ticket) throw new Error('Ticket no encontrado')
        if (ticket.estado !== 'Pendiente') {
          throw new Error('Solo se pueden eliminar tickets en estado Pendiente')
        }
        store.tickets = store.tickets.filter((item) => item.id !== id)
      })
    },
    async listMessages() {
      return readStore(storage, key).messages
    },
    async createMessage(input: NewMessage) {
      return update((store) => {
        const message = { ...input, id: createId('m'), creadaEn: new Date().toISOString() }
        store.messages.push(message)
        return message
      })
    },
    async reset() {
      writeStore(storage, key, cloneSeed())
    },
  }
}

export function createMemoryRepository() {
  return createStoreRepository(memoryStorage())
}
