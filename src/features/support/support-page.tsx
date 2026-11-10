import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { PageIntro, usePageTitle } from '@/components/page-intro'
import { controlClass, Field } from '@/components/ui/field'
import { ownsBooking } from '@/lib/api/types'
import { formatDate } from '@/lib/format'
import { useHotel } from '@/lib/hotel-context'
import { ticketSchema } from '@/lib/schemas'
import type { z } from 'zod'

export function SupportPage() {
  usePageTitle('Soporte')
  const { session, bookings, tickets, rooms, createTicket, deleteTicket } = useHotel()
  const [sent, setSent] = useState(false)
  const form = useForm<z.infer<typeof ticketSchema>>({
    resolver: zodResolver(ticketSchema),
    defaultValues: { reservaId: '', asunto: '', tipo: 'Queja', descripcion: '' },
  })
  if (session.role !== 'user') return null
  const user = session.user
  const mine = bookings.filter((booking) => ownsBooking(booking, user))
  const ownTickets = tickets.filter((ticket) => ticket.usuarioId === user.id)

  return (
    <>
      <PageIntro
        index="Soporte"
        title="Quejas y reclamos."
        lede="El ticket queda atado a una reserva tuya. Recepción responde desde el panel y solo puedes borrar el mensaje mientras está pendiente."
      />
      <div className="shell grid gap-12 pb-24 lg:grid-cols-2 lg:gap-16">
        {mine.length === 0 ? (
          <p className="text-muted">Primero necesitas una reserva a tu nombre.</p>
        ) : (
          <form
            className="grid gap-4"
            noValidate
            onSubmit={form.handleSubmit(async (values) => {
              try {
                await createTicket({ ...values, usuarioId: user.id })
                form.reset({ reservaId: '', asunto: '', tipo: 'Queja', descripcion: '' })
                setSent(true)
              } catch (error) {
                setSent(false)
                form.setError('root', {
                  message: error instanceof Error ? error.message : 'No se pudo crear el ticket',
                })
              }
            })}
          >
            <Field label="Reserva" error={form.formState.errors.reservaId?.message}>
              <select className={controlClass} {...form.register('reservaId')}>
                <option value="">Elige una</option>
                {mine.map((booking) => {
                  const room = rooms.find((item) => item.id === booking.habitacionId)
                  return (
                    <option key={booking.id} value={booking.id}>
                      {room?.nombre ?? 'Habitación'} · {formatDate(booking.fechaInicio)}
                    </option>
                  )
                })}
              </select>
            </Field>
            <Field label="Asunto" error={form.formState.errors.asunto?.message}>
              <input className={controlClass} {...form.register('asunto')} />
            </Field>
            <Field label="Tipo" error={form.formState.errors.tipo?.message}>
              <select className={controlClass} {...form.register('tipo')}>
                <option value="Queja">Queja</option>
                <option value="Reclamo">Reclamo</option>
              </select>
            </Field>
            <Field label="Descripción" error={form.formState.errors.descripcion?.message}>
              <textarea className={`${controlClass} min-h-32`} {...form.register('descripcion')} />
            </Field>
            {form.formState.errors.root ? (
              <p className="text-sm text-accent">{form.formState.errors.root.message}</p>
            ) : null}
            <button
              type="submit"
              className="h-12 bg-fg text-sm text-bg"
              onClick={() => {
                form.clearErrors('root')
              }}
            >
              Enviar ticket
            </button>
            {sent ? (
              <p className="text-sm text-muted">Ticket registrado. Queda en Pendiente.</p>
            ) : null}
          </form>
        )}
        <div>
          <h2 className="font-display text-3xl">Tus tickets</h2>
          {ownTickets.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No hay tickets todavía.</p>
          ) : (
            <ul className="mt-4 border-b border-line">
              {ownTickets.map((ticket) => (
                <li key={ticket.id} className="border-t border-line py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">{ticket.asunto}</p>
                      <p className="mt-1 text-sm text-muted">
                        {ticket.tipo} · {ticket.estado}
                      </p>
                    </div>
                    {ticket.estado === 'Pendiente' ? (
                      <button
                        type="button"
                        className="text-sm underline underline-offset-4"
                        onClick={() => deleteTicket(ticket.id)}
                      >
                        Eliminar
                      </button>
                    ) : null}
                  </div>
                  <p className="mt-3 text-sm">{ticket.descripcion}</p>
                  {ticket.respuesta ? (
                    <p className="mt-3 border-l-2 border-accent pl-3 text-sm">
                      Recepción: {ticket.respuesta}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}
