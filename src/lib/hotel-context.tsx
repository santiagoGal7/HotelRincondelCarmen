import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { createRepository } from '@/lib/api'
import { cloneSeed } from '@/lib/api/seed'
import type {
  Booking,
  ContactMessage,
  HotelRepository,
  NewBooking,
  NewMessage,
  NewTicket,
  NewUser,
  PublicUser,
  Room,
  Session,
  Ticket,
} from '@/lib/api/types'

type HotelContextValue = {
  ready: boolean
  error: string | null
  source: 'local' | 'http'
  rooms: Room[]
  bookings: Booking[]
  tickets: Ticket[]
  messages: ContactMessage[]
  users: PublicUser[]
  session: Session
  refresh: () => Promise<void>
  register: (input: NewUser) => Promise<void>
  login: (id: string, password: string) => Promise<void>
  loginAdmin: (username: string, password: string) => Promise<void>
  logout: () => void
  createBooking: (input: NewBooking) => Promise<Booking>
  cancelBooking: (id: string) => Promise<void>
  saveRoom: (room: Room) => Promise<void>
  deleteRoom: (id: string) => Promise<void>
  createTicket: (input: NewTicket) => Promise<void>
  updateTicket: (id: string, patch: Pick<Ticket, 'estado' | 'respuesta'>) => Promise<void>
  deleteTicket: (id: string) => Promise<void>
  sendMessage: (input: NewMessage) => Promise<void>
  resetDemo: () => Promise<void>
}

const HotelContext = createContext<HotelContextValue | null>(null)
const SESSION_KEY = 'rdc.session'

function readInitialRooms() {
  if (import.meta.env.VITE_DATA_SOURCE === 'http' || typeof localStorage === 'undefined')
    return null
  try {
    const raw = localStorage.getItem('rdc.v1')
    if (!raw) return cloneSeed()
    return JSON.parse(raw) as ReturnType<typeof cloneSeed>
  } catch {
    return cloneSeed()
  }
}

function readSession(): Session {
  if (typeof sessionStorage === 'undefined') return { role: 'guest' }
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return { role: 'guest' }
    const parsed = JSON.parse(raw) as Session
    if (parsed.role === 'admin' || parsed.role === 'guest') return parsed
    if (parsed.role === 'user' && parsed.user?.id) return parsed
  } catch {
    /* sesión inválida */
  }
  return { role: 'guest' }
}

export function HotelProvider({ children }: { children: ReactNode }) {
  const source = import.meta.env.VITE_DATA_SOURCE === 'http' ? 'http' : 'local'
  const repo = useMemo<HotelRepository>(() => createRepository(), [])
  const initial = useMemo(() => readInitialRooms(), [])
  const [rooms, setRooms] = useState<Room[]>(initial?.rooms ?? [])
  const [bookings, setBookings] = useState<Booking[]>(initial?.bookings ?? [])
  const [tickets, setTickets] = useState<Ticket[]>(initial?.tickets ?? [])
  const [messages, setMessages] = useState<ContactMessage[]>(initial?.messages ?? [])
  const [users, setUsers] = useState<PublicUser[]>([])
  const [session, setSession] = useState<Session>(readSession)
  const [ready, setReady] = useState(source === 'local')
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    const [nextRooms, nextBookings, nextTickets, nextMessages, nextUsers] = await Promise.all([
      repo.listRooms(),
      repo.listBookings(),
      repo.listTickets(),
      repo.listMessages(),
      repo.listUsers(),
    ])
    setRooms(nextRooms)
    setBookings(nextBookings)
    setTickets(nextTickets)
    setMessages(nextMessages)
    setUsers(nextUsers)
  }, [repo])

  useEffect(() => {
    let alive = true
    // La carga inicial tiene que escribir el estado cuando responde el almacén.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch de arranque
    refresh()
      .then(() => {
        if (alive) setError(null)
      })
      .catch(() => {
        if (alive)
          setError(
            'No se pudieron cargar los datos. Si usas la API, revisa que json-server esté en marcha.',
          )
      })
      .finally(() => {
        if (alive) setReady(true)
      })
    return () => {
      alive = false
    }
  }, [refresh])

  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  }, [session])

  const run = useCallback(
    async (fn: () => Promise<void>) => {
      await fn()
      await refresh()
    },
    [refresh],
  )

  const value: HotelContextValue = {
    ready,
    error,
    source,
    rooms,
    bookings,
    tickets,
    messages,
    users,
    session,
    refresh,
    register: (input) =>
      run(async () => {
        const user = await repo.registerUser(input)
        setSession({ role: 'user', user })
      }),
    login: (id, password) =>
      run(async () => {
        const user = await repo.loginUser(id, password)
        setSession({ role: 'user', user })
      }),
    loginAdmin: (username, password) =>
      run(async () => {
        await repo.loginAdmin(username, password)
        setSession({ role: 'admin' })
      }),
    logout: () => setSession({ role: 'guest' }),
    createBooking: async (input) => {
      const booking = await repo.createBooking(input)
      await refresh()
      return booking
    },
    cancelBooking: (id) => run(() => repo.cancelBooking(id).then(() => undefined)),
    saveRoom: (room) => run(() => repo.saveRoom(room).then(() => undefined)),
    deleteRoom: (id) => run(() => repo.deleteRoom(id)),
    createTicket: (input) => run(() => repo.createTicket(input).then(() => undefined)),
    updateTicket: (id, patch) => run(() => repo.updateTicket(id, patch).then(() => undefined)),
    deleteTicket: (id) => {
      if (session.role !== 'user')
        return Promise.reject(new Error('Inicia sesión para borrar el ticket'))
      return run(() => repo.deleteTicket(id, session.user.id))
    },
    sendMessage: (input) => run(() => repo.createMessage(input).then(() => undefined)),
    resetDemo: () => run(() => repo.reset()),
  }

  return <HotelContext.Provider value={value}>{children}</HotelContext.Provider>
}

export function useHotel() {
  const value = useContext(HotelContext)
  if (!value) throw new Error('useHotel fuera de HotelProvider')
  return value
}
