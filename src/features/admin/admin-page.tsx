import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Photo } from '@/components/photo'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { controlClass, Field } from '@/components/ui/field'
import { mediaLibrary, typeLabel } from '@/data/content'
import { occupancyPercent } from '@/lib/booking'
import { createId, formatCop, formatDate, formatDateTime, slugify } from '@/lib/format'
import { useHotel } from '@/lib/hotel-context'
import { usePageTitle } from '@/components/page-intro'
import { cn } from '@/lib/cn'
import type { Room, RoomType, TicketStatus } from '@/lib/api/types'

type Section = 'resumen' | 'habitaciones' | 'reservas' | 'tickets' | 'mensajes'

const sections: Array<{ id: Section; label: string }> = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'habitaciones', label: 'Habitaciones' },
  { id: 'reservas', label: 'Reservas' },
  { id: 'tickets', label: 'Tickets' },
  { id: 'mensajes', label: 'Mensajes' },
]

function blankRoom(): Room {
  return {
    id: createId('h'),
    slug: '',
    nombre: '',
    tipo: 'estandar',
    resumen: '',
    descripcion: '',
    camas: 1,
    maxPersonas: 2,
    precioNoche: 100000,
    superficie: 18,
    servicios: ['internet'],
    imagenes: ['room-standard-1'],
  }
}

export function AdminPage() {
  usePageTitle('Recepción')
  const hotel = useHotel()
  const [section, setSection] = useState<Section>('resumen')
  const [editing, setEditing] = useState<Room | null>(null)
  const [servicesText, setServicesText] = useState('internet')
  const [notice, setNotice] = useState<string | null>(null)
  const [reply, setReply] = useState<{
    id: string
    estado: TicketStatus
    respuesta: string
  } | null>(null)
  const today = new Date()
  const occupancy = occupancyPercent(
    hotel.rooms.length,
    hotel.bookings,
    today.getFullYear(),
    today.getMonth(),
  )
  const openTickets = hotel.tickets.filter((ticket) => ticket.estado !== 'Resuelto').length
  const confirmed = hotel.bookings.filter((booking) => booking.estado === 'confirmada').length

  function openRoom(room: Room | null) {
    const next = room ? structuredClone(room) : blankRoom()
    setEditing(next)
    setServicesText(next.servicios.join(', '))
    setNotice(null)
  }

  async function saveRoom() {
    if (!editing) return
    const room: Room = {
      ...editing,
      nombre: editing.nombre.trim(),
      slug: editing.slug.trim() || slugify(editing.nombre),
      resumen: editing.resumen.trim(),
      descripcion: editing.descripcion.trim(),
      servicios: servicesText
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    }
    try {
      await hotel.saveRoom(room)
      setEditing(null)
      setNotice('Habitación guardada.')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'No se pudo guardar')
    }
  }

  return (
    <div className="min-h-screen bg-bg text-fg lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-line lg:min-h-screen lg:border-r lg:border-b-0">
        <div className="px-5 py-6">
          <p className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">Recepción</p>
          <p className="mt-2 font-display text-2xl tracking-tight">El Rincón</p>
        </div>
        <nav className="flex flex-wrap gap-2 px-4 pb-4 lg:grid lg:px-3" aria-label="Administración">
          {sections.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-current={section === item.id ? 'page' : undefined}
              onClick={() => setSection(item.id)}
              className="chip w-full text-left"
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="hidden px-5 py-6 text-sm lg:grid lg:gap-3">
          <Link to="/" className="underline underline-offset-4">
            Volver al sitio
          </Link>
          <button
            type="button"
            className="text-left underline underline-offset-4"
            onClick={hotel.logout}
          >
            Salir
          </button>
        </div>
      </aside>

      <div className="min-w-0 px-5 py-10 sm:px-8 lg:px-12 lg:py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">
              {sections.find((item) => item.id === section)?.label}
            </p>
            <h1 className="mt-2 font-display text-4xl tracking-tight">Panel de la casa</h1>
          </div>
          <div className="flex gap-3 text-sm lg:hidden">
            <Link to="/" className="underline underline-offset-4">
              Sitio
            </Link>
            <button type="button" className="underline underline-offset-4" onClick={hotel.logout}>
              Salir
            </button>
          </div>
        </div>
        {notice ? (
          <p className="mb-4 text-sm" role="status">
            {notice}
          </p>
        ) : null}

        {section === 'resumen' ? (
          <div>
            <dl className="panel grid gap-2 sm:grid-cols-4">
              {[
                [String(hotel.rooms.length), 'Habitaciones'],
                [String(confirmed), 'Reservas activas'],
                [String(openTickets), 'Tickets abiertos'],
                [`${occupancy}%`, 'Ocupación del mes'],
              ].map(([value, label]) => (
                <div key={label} className="border-b border-line px-1 py-6 sm:border-b-0 sm:px-4">
                  <dt className="text-sm text-muted">{label}</dt>
                  <dd className="mt-2 font-display text-4xl tracking-tight">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">
              La ocupación cuenta noches confirmadas de este mes sobre el cupo de las habitaciones
              publicadas. {hotel.users.length} huéspedes registrados. Los datos viven en{' '}
              {hotel.source === 'http' ? 'json-server' : 'este navegador'}.
            </p>
            <ul className="mt-8 max-w-3xl border-t border-line">
              {hotel.rooms.map((room) => (
                <li
                  key={room.id}
                  className="flex items-baseline justify-between gap-4 border-b border-line py-4"
                >
                  <span>
                    <span className="block font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
                      {room.tipo}
                    </span>
                    <span className="font-display text-3xl">{room.nombre}</span>
                  </span>
                  <span className="font-mono text-sm">{formatCop(room.precioNoche)}</span>
                </li>
              ))}
            </ul>
            <Button
              type="button"
              variant="secondary"
              className="mt-6"
              onClick={async () => {
                await hotel.resetDemo()
                setNotice('Datos de demostración restablecidos.')
              }}
            >
              Restablecer demostración
            </Button>
          </div>
        ) : null}

        {section === 'habitaciones' ? (
          <div>
            <Button type="button" variant="primary" arrow className="mb-6" onClick={() => openRoom(null)}>
              Nueva habitación
            </Button>
            <ul className="border-b border-line">
              {hotel.rooms.map((room) => (
                <li
                  key={room.id}
                  className="grid items-center gap-4 border-t border-line py-4 md:grid-cols-[96px_1fr_auto]"
                >
                  <Photo name={room.imagenes[0]} alt="" className="h-16 w-24 object-cover" />
                  <div>
                    <p className="font-medium">{room.nombre}</p>
                    <p className="text-sm text-muted">
                      {typeLabel[room.tipo]} · {formatCop(room.precioNoche)} · {room.maxPersonas}{' '}
                      personas
                    </p>
                  </div>
                  <div className="flex gap-3 text-sm">
                    <button
                      type="button"
                      className="underline underline-offset-4"
                      onClick={() => openRoom(room)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="underline underline-offset-4"
                      onClick={async () => {
                        try {
                          await hotel.deleteRoom(room.id)
                          setNotice('Habitación eliminada.')
                        } catch (error) {
                          setNotice(error instanceof Error ? error.message : 'No se pudo eliminar')
                        }
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {section === 'reservas' ? (
          <div className="panel min-w-0 overflow-x-auto">
            <table className="w-full min-w-[720px] border-t border-line text-left text-sm">
              <thead className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
                <tr>
                  <th className="py-3 font-normal">Huésped</th>
                  <th className="py-3 font-normal">Habitación</th>
                  <th className="py-3 font-normal">Fechas</th>
                  <th className="py-3 font-normal">Total</th>
                  <th className="py-3 font-normal">Estado</th>
                </tr>
              </thead>
              <tbody>
                {hotel.bookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="border-t border-line py-6 text-muted">
                      Todavía no hay reservas.
                    </td>
                  </tr>
                ) : (
                  hotel.bookings.map((booking) => {
                    const room = hotel.rooms.find((item) => item.id === booking.habitacionId)
                    return (
                      <tr key={booking.id} className="border-t border-line">
                        <td className="py-3">
                          {booking.huesped.nombre}
                          <span className="block text-muted">{booking.huesped.email}</span>
                        </td>
                        <td className="py-3">{room?.nombre ?? booking.habitacionId}</td>
                        <td className="py-3">
                          {formatDate(booking.fechaInicio)} — {formatDate(booking.fechaFin)}
                        </td>
                        <td className="py-3 font-mono">{formatCop(booking.total)}</td>
                        <td className="py-3">
                          {booking.estado === 'confirmada' ? (
                            <button
                              type="button"
                              className="underline underline-offset-4"
                              onClick={() => hotel.cancelBooking(booking.id)}
                            >
                              Cancelar
                            </button>
                          ) : (
                            'Cancelada'
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : null}

        {section === 'tickets' ? (
          <ul className="border-b border-line">
            {hotel.tickets.length === 0 ? (
              <li className="border-t border-line py-6 text-sm text-muted">No hay tickets.</li>
            ) : (
              hotel.tickets.map((ticket) => (
                <li key={ticket.id} className="border-t border-line py-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <p className="font-medium">{ticket.asunto}</p>
                    <p className="text-sm text-muted">
                      {ticket.tipo} · {ticket.estado}
                    </p>
                  </div>
                  <p className="mt-2 text-sm">{ticket.descripcion}</p>
                  {ticket.respuesta ? (
                    <p className="mt-2 text-sm text-muted">Respuesta: {ticket.respuesta}</p>
                  ) : null}
                  <button
                    type="button"
                    className="mt-3 text-sm underline underline-offset-4"
                    onClick={() =>
                      setReply({
                        id: ticket.id,
                        estado: ticket.estado,
                        respuesta: ticket.respuesta,
                      })
                    }
                  >
                    Responder
                  </button>
                </li>
              ))
            )}
          </ul>
        ) : null}

        {section === 'mensajes' ? (
          <ul className="border-b border-line">
            {hotel.messages.length === 0 ? (
              <li className="border-t border-line py-6 text-sm text-muted">
                No hay mensajes de contacto.
              </li>
            ) : (
              hotel.messages.map((message) => (
                <li key={message.id} className="border-t border-line py-4">
                  <p className="font-medium">{message.nombre}</p>
                  <p className="text-sm text-muted">
                    {message.email} · {formatDateTime(message.creadaEn)}
                  </p>
                  <p className="mt-2 text-sm">{message.mensaje}</p>
                </li>
              ))
            )}
          </ul>
        ) : null}
      </div>

      <Modal
        open={Boolean(editing)}
        onOpenChange={(open) => {
          if (!open) setEditing(null)
        }}
        title={
          editing && hotel.rooms.some((room) => room.id === editing.id)
            ? 'Editar habitación'
            : 'Nueva habitación'
        }
        description="Nombre, tipo, tarifa y fotos de la biblioteca."
      >
        {editing ? (
          <div className="grid gap-4">
            <Field label="Nombre">
              <input
                className={controlClass}
                value={editing.nombre}
                onChange={(event) =>
                  setEditing({
                    ...editing,
                    nombre: event.target.value,
                    slug: slugify(event.target.value),
                  })
                }
              />
            </Field>
            <Field label="Slug">
              <input
                className={controlClass}
                value={editing.slug}
                onChange={(event) => setEditing({ ...editing, slug: event.target.value })}
              />
            </Field>
            <Field label="Tipo">
              <select
                className={controlClass}
                value={editing.tipo}
                onChange={(event) =>
                  setEditing({ ...editing, tipo: event.target.value as RoomType })
                }
              >
                <option value="estandar">Estándar</option>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suite</option>
              </select>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Camas">
                <input
                  className={controlClass}
                  type="number"
                  min={1}
                  value={editing.camas}
                  onChange={(event) =>
                    setEditing({ ...editing, camas: Number(event.target.value) })
                  }
                />
              </Field>
              <Field label="Máximo de personas">
                <input
                  className={controlClass}
                  type="number"
                  min={1}
                  value={editing.maxPersonas}
                  onChange={(event) =>
                    setEditing({ ...editing, maxPersonas: Number(event.target.value) })
                  }
                />
              </Field>
              <Field label="Precio por noche">
                <input
                  className={controlClass}
                  type="number"
                  min={1}
                  value={editing.precioNoche}
                  onChange={(event) =>
                    setEditing({ ...editing, precioNoche: Number(event.target.value) })
                  }
                />
              </Field>
              <Field label="Superficie m²">
                <input
                  className={controlClass}
                  type="number"
                  min={1}
                  value={editing.superficie}
                  onChange={(event) =>
                    setEditing({ ...editing, superficie: Number(event.target.value) })
                  }
                />
              </Field>
            </div>
            <Field label="Resumen">
              <input
                className={controlClass}
                value={editing.resumen}
                onChange={(event) => setEditing({ ...editing, resumen: event.target.value })}
              />
            </Field>
            <Field label="Descripción">
              <textarea
                className={`${controlClass} min-h-28`}
                value={editing.descripcion}
                onChange={(event) => setEditing({ ...editing, descripcion: event.target.value })}
              />
            </Field>
            <Field label="Servicios" hint="Separados por coma.">
              <input
                className={controlClass}
                value={servicesText}
                onChange={(event) => setServicesText(event.target.value)}
              />
            </Field>
            <fieldset>
              <legend className="mb-2 text-sm font-medium">Imágenes</legend>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {mediaLibrary.map((name) => {
                  const checked = editing.imagenes.includes(name)
                  return (
                    <label
                      key={name}
                      className={cn('block border', checked ? 'border-fg' : 'border-transparent')}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={checked}
                        onChange={() =>
                          setEditing({
                            ...editing,
                            imagenes: checked
                              ? editing.imagenes.filter((item) => item !== name)
                              : [...editing.imagenes, name],
                          })
                        }
                      />
                      <Photo name={name} alt={name} className="aspect-[4/3] w-full object-cover" />
                    </label>
                  )
                })}
              </div>
            </fieldset>
            {notice ? <p className="text-sm text-accent">{notice}</p> : null}
            <Button type="button" variant="primary" arrow className="btn-block" onClick={saveRoom}>
              Guardar habitación
            </Button>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(reply)}
        onOpenChange={(open) => {
          if (!open) setReply(null)
        }}
        title="Responder ticket"
        description="La respuesta queda visible para el huésped."
      >
        {reply ? (
          <form
            className="grid gap-4"
            onSubmit={async (event) => {
              event.preventDefault()
              await hotel.updateTicket(reply.id, {
                estado: reply.estado,
                respuesta: reply.respuesta,
              })
              setReply(null)
              setNotice('Ticket actualizado.')
            }}
          >
            <Field label="Estado">
              <select
                className={controlClass}
                value={reply.estado}
                onChange={(event) =>
                  setReply({ ...reply, estado: event.target.value as TicketStatus })
                }
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En proceso">En proceso</option>
                <option value="Resuelto">Resuelto</option>
              </select>
            </Field>
            <Field label="Respuesta">
              <textarea
                className={`${controlClass} min-h-32`}
                required
                value={reply.respuesta}
                onChange={(event) => setReply({ ...reply, respuesta: event.target.value })}
              />
            </Field>
            <Button type="submit" variant="primary" arrow className="btn-block">
              Guardar respuesta
            </Button>
          </form>
        ) : null}
      </Modal>
    </div>
  )
}
