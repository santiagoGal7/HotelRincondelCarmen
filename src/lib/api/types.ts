export type RoomType = 'estandar' | 'deluxe' | 'suite'
export type BookingStatus = 'confirmada' | 'cancelada'
export type TicketType = 'Queja' | 'Reclamo'
export type TicketStatus = 'Pendiente' | 'En proceso' | 'Resuelto'

export type Room = {
  id: string
  slug: string
  nombre: string
  tipo: RoomType
  resumen: string
  descripcion: string
  camas: number
  maxPersonas: number
  precioNoche: number
  superficie: number
  servicios: string[]
  imagenes: string[]
}

export type User = {
  id: string
  nombre: string
  nacionalidad: string
  email: string
  telefono: string
  password: string
}

export type PublicUser = Omit<User, 'password'>

export type Guest = {
  nombre: string
  email: string
  telefono: string
}

export type Booking = {
  id: string
  habitacionId: string
  usuarioId: string | null
  huesped: Guest
  fechaInicio: string
  fechaFin: string
  personas: number
  noches: number
  total: number
  estado: BookingStatus
  notas: string
  creadaEn: string
}

export type Ticket = {
  id: string
  reservaId: string
  usuarioId: string
  asunto: string
  tipo: TicketType
  descripcion: string
  estado: TicketStatus
  respuesta: string
  creadaEn: string
}

export type ContactMessage = {
  id: string
  nombre: string
  email: string
  mensaje: string
  creadaEn: string
}

export type Store = {
  rooms: Room[]
  users: User[]
  bookings: Booking[]
  tickets: Ticket[]
  messages: ContactMessage[]
}

export type NewUser = Omit<User, never>
export type NewBooking = {
  habitacionId: string
  usuarioId: string | null
  huesped: Guest
  fechaInicio: string
  fechaFin: string
  personas: number
  notas?: string
}
export type NewTicket = {
  reservaId: string
  usuarioId: string
  asunto: string
  tipo: TicketType
  descripcion: string
}
export type NewMessage = Omit<ContactMessage, 'id' | 'creadaEn'>

export type Session = { role: 'guest' } | { role: 'user'; user: PublicUser } | { role: 'admin' }

export interface HotelRepository {
  listRooms(): Promise<Room[]>
  saveRoom(room: Room): Promise<Room>
  deleteRoom(id: string): Promise<void>
  listBookings(): Promise<Booking[]>
  createBooking(input: NewBooking): Promise<Booking>
  cancelBooking(id: string): Promise<Booking>
  listUsers(): Promise<PublicUser[]>
  registerUser(input: NewUser): Promise<PublicUser>
  loginUser(id: string, password: string): Promise<PublicUser>
  loginAdmin(username: string, password: string): Promise<void>
  listTickets(): Promise<Ticket[]>
  createTicket(input: NewTicket): Promise<Ticket>
  updateTicket(id: string, patch: Pick<Ticket, 'estado' | 'respuesta'>): Promise<Ticket>
  deleteTicket(id: string, usuarioId: string): Promise<void>
  listMessages(): Promise<ContactMessage[]>
  createMessage(input: NewMessage): Promise<ContactMessage>
  reset(): Promise<void>
}

export const ADMIN_USERNAME = 'admin'
export const ADMIN_PASSWORD = 'admin123'

export function publicUser(user: User): PublicUser {
  return {
    id: user.id,
    nombre: user.nombre,
    nacionalidad: user.nacionalidad,
    email: user.email,
    telefono: user.telefono,
  }
}

export function ownsBooking(booking: Booking, user: PublicUser) {
  return (
    booking.usuarioId === user.id ||
    booking.huesped.email.trim().toLowerCase() === user.email.trim().toLowerCase()
  )
}
