import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageIntro, usePageTitle } from '@/components/page-intro'
import { ownsBooking } from '@/lib/api/types'
import { formatCop, formatDate } from '@/lib/format'
import { useHotel } from '@/lib/hotel-context'

export function AccountPage() {
  usePageTitle('Mis reservas')
  const { session, bookings, rooms, cancelBooking } = useHotel()
  const [pending, setPending] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  if (session.role !== 'user') return null
  const user = session.user
  const mine = bookings.filter((booking) => ownsBooking(booking, user))

  return (
    <>
      <PageIntro
        index={user.nombre}
        title="Tus reservas."
        lede={`${user.nacionalidad} · ${user.email} · ${user.telefono}`}
      />
      <div className="shell pb-24">
        <div className="mb-8 flex flex-wrap gap-3">
          <Link
            to="/reservar"
            className="inline-flex h-11 items-center bg-accent px-4 text-sm text-accent-fg"
          >
            Nueva reserva
          </Link>
          <Link
            to="/soporte"
            className="inline-flex h-11 items-center border border-line px-4 text-sm"
          >
            Quejas y reclamos
          </Link>
        </div>
        {error ? (
          <p role="alert" className="mb-4 text-sm text-accent">
            {error}
          </p>
        ) : null}
        {mine.length === 0 ? (
          <p className="border-t border-line py-8 text-muted">
            Todavía no hay reservas con tu identificación o tu correo.
          </p>
        ) : (
          <ul className="border-b border-line">
            {mine.map((booking) => {
              const room = rooms.find((item) => item.id === booking.habitacionId)
              return (
                <li
                  key={booking.id}
                  className="grid gap-3 border-t border-line py-5 md:grid-cols-[1.4fr_1fr_auto] md:items-center"
                >
                  <div>
                    <p className="font-display text-2xl">{room?.nombre ?? 'Habitación'}</p>
                    <p className="mt-1 text-sm text-muted">
                      {formatDate(booking.fechaInicio)} — {formatDate(booking.fechaFin)} ·{' '}
                      {booking.personas} huéspedes
                    </p>
                  </div>
                  <p className="font-mono text-sm">
                    {formatCop(booking.total)} · {booking.estado}
                  </p>
                  {booking.estado === 'confirmada' ? (
                    pending === booking.id ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="h-10 bg-fg px-3 text-sm text-bg"
                          onClick={async () => {
                            setError(null)
                            try {
                              await cancelBooking(booking.id)
                              setPending(null)
                            } catch (caught) {
                              setError(
                                caught instanceof Error ? caught.message : 'No se pudo cancelar',
                              )
                            }
                          }}
                        >
                          Confirmar
                        </button>
                        <button
                          type="button"
                          className="h-10 px-3 text-sm"
                          onClick={() => setPending(null)}
                        >
                          Volver
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="h-10 text-left text-sm underline underline-offset-4"
                        onClick={() => setPending(booking.id)}
                      >
                        Cancelar
                      </button>
                    )
                  ) : (
                    <span className="text-sm text-muted">Cerrada</span>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )
}
