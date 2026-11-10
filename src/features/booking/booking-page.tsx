import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { DayPicker, type DateRange } from 'react-day-picker'
import { es } from 'react-day-picker/locale'
import 'react-day-picker/style.css'
import '@/features/booking/calendar.css'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PriceSummary } from '@/components/price-summary'
import { PageIntro, usePageTitle } from '@/components/page-intro'
import { Button } from '@/components/ui/button'
import { controlClass, Field } from '@/components/ui/field'
import { typeLabel } from '@/data/content'
import { isRoomAvailable, quoteMessage, quoteStay, toISODate } from '@/lib/booking'
import { formatCop, formatDate } from '@/lib/format'
import { useHotel } from '@/lib/hotel-context'
import { guestSchema, type GuestValues } from '@/lib/schemas'
import { cn } from '@/lib/cn'
import type { Booking } from '@/lib/api/types'

function startOfToday() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

function useWideCalendar() {
  const [wide, setWide] = useState(false)
  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)')
    const update = () => setWide(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  return wide
}

export function BookingPage() {
  usePageTitle('Reservar')
  const { slug } = useParams()
  const navigate = useNavigate()
  const wide = useWideCalendar()
  const { rooms, bookings, session, createBooking, source } = useHotel()
  const selected = slug ? rooms.find((room) => room.slug === slug) : rooms[0]
  const [range, setRange] = useState<DateRange | undefined>()
  const [guestCount, setGuestCount] = useState(2)
  const guests = Math.min(Math.max(1, guestCount), selected?.maxPersonas ?? 6)
  const [done, setDone] = useState<Booking | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug && rooms[0]) navigate(`/reservar/${rooms[0].slug}`, { replace: true })
  }, [slug, rooms, navigate])

  const checkIn = range?.from ? toISODate(range.from) : ''
  const checkOut = range?.to ? toISODate(range.to) : ''
  const quote = useMemo(() => {
    if (!selected || !checkIn || !checkOut) return null
    return quoteStay({
      checkIn,
      checkOut,
      guests,
      precioNoche: selected.precioNoche,
      maxPersonas: selected.maxPersonas,
      today: toISODate(startOfToday()),
    })
  }, [selected, checkIn, checkOut, guests])

  const available = Boolean(
    selected && quote?.ok && isRoomAvailable(bookings, selected.id, checkIn, checkOut),
  )

  const form = useForm<GuestValues>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      nombre: session.role === 'user' ? session.user.nombre : '',
      email: session.role === 'user' ? session.user.email : '',
      telefono: session.role === 'user' ? session.user.telefono : '',
      notas: '',
    },
  })

  const status = !selected
    ? 'No hay habitaciones cargadas.'
    : !checkIn
      ? 'Elige la llegada y la salida en el calendario.'
      : !checkOut
        ? 'Ahora marca el día de salida.'
        : quote && !quote.ok
          ? quoteMessage(quote.error)
          : !available
            ? 'Esas fechas ya están tomadas. La salida de otra reserva sí queda libre.'
            : 'Disponible. El total de abajo es el que se guarda.'

  async function onSubmit(values: GuestValues) {
    if (!selected || !quote?.ok || !available) {
      setSubmitError(status)
      return
    }
    setSubmitError(null)
    try {
      const booking = await createBooking({
        habitacionId: selected.id,
        usuarioId: session.role === 'user' ? session.user.id : null,
        huesped: {
          nombre: values.nombre,
          email: values.email.trim().toLowerCase(),
          telefono: values.telefono,
        },
        fechaInicio: checkIn,
        fechaFin: checkOut,
        personas: guests,
        notas: values.notas,
      })
      setDone(booking)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'No se pudo guardar la reserva')
    }
  }

  if (done && selected) {
    return (
      <div className="shell max-w-3xl pt-32 pb-24">
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
          Reserva confirmada
        </p>
        <h1 className="mt-3 font-display text-5xl tracking-tight">
          Listo, {done.huesped.nombre.split(' ')[0]}.
        </h1>
        <p className="mt-4 text-muted">
          {selected.nombre}, del {formatDate(done.fechaInicio)} al {formatDate(done.fechaFin)}.{' '}
          {done.noches} {done.noches === 1 ? 'noche' : 'noches'} · {formatCop(done.total)}.
        </p>
        <p className="mt-4 font-mono text-sm">Código {done.id}</p>
        <p className="mt-4 text-sm text-muted">
          No hubo cobro. La reserva quedó en{' '}
          {source === 'http' ? 'el servidor local' : 'este navegador'}.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {session.role === 'user' ? (
            <Button asChild variant="primary" arrow>
              <Link to="/cuenta">Ver mis reservas</Link>
            </Button>
          ) : (
            <Button asChild variant="primary" arrow>
              <Link to="/entrar">Crear cuenta con este correo</Link>
            </Button>
          )}
          <Button type="button" variant="secondary" onClick={() => setDone(null)}>
            Hacer otra
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <PageIntro
        index="Reservar"
        title="Fechas, personas y un total claro."
        lede="La salida no se cobra: esa mañana la habitación queda libre. Puedes reservar como invitado o con tu cuenta."
      />
      <div className="shell grid gap-12 pb-24 lg:grid-cols-12 lg:gap-16">
        <form
          id="reserva"
          className="grid gap-10 lg:col-span-7"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <fieldset>
            <legend className="font-display text-2xl">1. Habitación</legend>
            <div className="mt-4 border-b border-line">
              {rooms.map((room) => {
                const active = room.id === selected?.id
                return (
                  <label
                    key={room.id}
                    className={cn(
                      'grid cursor-pointer gap-1 border-t border-line py-4 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-4',
                      active && 'bg-elev/60',
                    )}
                  >
                    <input
                      type="radio"
                      name="habitacion"
                      className="mt-1"
                      checked={active}
                      onChange={() => navigate(`/reservar/${room.slug}`)}
                    />
                    <span>
                      <span className="block font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
                        {typeLabel[room.tipo]}
                      </span>
                      <span className="font-display text-2xl">{room.nombre}</span>
                      <span className="mt-1 block text-sm text-muted">
                        Hasta {room.maxPersonas} personas
                      </span>
                    </span>
                    <span className="font-mono text-sm">{formatCop(room.precioNoche)}</span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-display text-2xl">2. Fechas</legend>
            <p className="mt-2 text-sm text-muted" aria-live="polite">
              {status}
            </p>
            <div className="mt-4 overflow-x-auto">
              <DayPicker
                mode="range"
                selected={range}
                onSelect={setRange}
                locale={es}
                weekStartsOn={1}
                disabled={{ before: startOfToday() }}
                numberOfMonths={wide ? 2 : 1}
                resetOnSelect
                excludeDisabled
              />
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-display text-2xl">3. Huéspedes</legend>
            <div className="mt-4 flex items-center gap-4">
              <Button
                type="button"
                variant="icon"
                aria-label="Quitar huésped"
                onClick={() => setGuestCount((value) => Math.max(1, value - 1))}
              >
                −
              </Button>
              <output className="min-w-24 text-center font-mono" aria-live="polite">
                {guests} {guests === 1 ? 'persona' : 'personas'}
              </output>
              <Button
                type="button"
                variant="icon"
                aria-label="Añadir huésped"
                onClick={() =>
                  setGuestCount((value) => Math.min(selected?.maxPersonas ?? value + 1, value + 1))
                }
              >
                +
              </Button>
            </div>
          </fieldset>

          <fieldset className="grid gap-4">
            <legend className="font-display text-2xl">4. Quién llega</legend>
            {session.role === 'guest' ? (
              <p className="text-sm text-muted">
                Sigues como invitado.{' '}
                <Link to="/entrar" className="underline underline-offset-4">
                  Entra
                </Link>{' '}
                si quieres ver la reserva después en tu cuenta.
              </p>
            ) : null}
            <Field label="Nombre" error={form.formState.errors.nombre?.message}>
              <input className={controlClass} autoComplete="name" {...form.register('nombre')} />
            </Field>
            <Field label="Correo" error={form.formState.errors.email?.message}>
              <input
                className={controlClass}
                type="email"
                autoComplete="email"
                {...form.register('email')}
              />
            </Field>
            <Field label="Teléfono" error={form.formState.errors.telefono?.message}>
              <input
                className={controlClass}
                type="tel"
                autoComplete="tel"
                {...form.register('telefono')}
              />
            </Field>
            <Field
              label="Notas"
              hint="Opcional. Hora de llegada, cama extra, algo que recepción deba saber."
              error={form.formState.errors.notas?.message}
            >
              <textarea className={cn(controlClass, 'min-h-28')} {...form.register('notas')} />
            </Field>
          </fieldset>
          {submitError ? (
            <p role="alert" className="text-sm text-accent">
              {submitError}
            </p>
          ) : null}
        </form>

        <aside className="panel h-fit lg:sticky lg:top-24 lg:col-span-5">
          {selected && quote?.ok ? (
            <PriceSummary
              roomName={selected.nombre}
              nights={quote.nights}
              rate={selected.precioNoche}
              guests={guests}
            />
          ) : (
            <div>
              <p className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">
                Resumen
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{status}</p>
            </div>
          )}
          <Button
            type="submit"
            form="reserva"
            variant="primary"
            arrow
            className="btn-block mt-6"
            loading={form.formState.isSubmitting}
          >
            Confirmar reserva
          </Button>
        </aside>
      </div>
    </>
  )
}
