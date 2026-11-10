import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Lightbox } from '@/components/cinematic/lightbox'
import { Photo } from '@/components/photo'
import { usePageTitle } from '@/components/page-intro'
import { typeLabel } from '@/data/content'
import { formatCop } from '@/lib/format'
import { useHotel } from '@/lib/hotel-context'

export function RoomPage() {
  const { slug } = useParams()
  const { rooms } = useHotel()
  const room = rooms.find((item) => item.slug === slug)
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  usePageTitle(room?.nombre ?? 'Habitación')

  if (!room) {
    return (
      <div className="shell pt-36 pb-20">
        <h1 className="font-display text-5xl tracking-tight">Esa habitación no está.</h1>
        <Link to="/habitaciones" className="mt-6 inline-flex underline underline-offset-4">
          Volver al listado
        </Link>
      </div>
    )
  }

  const image = room.imagenes[active] ?? room.imagenes[0]

  return (
    <article className="pt-24">
      <div className="shell grid gap-10 pb-20 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <button
            type="button"
            className="group block w-full overflow-hidden"
            onClick={() => setOpen(true)}
            aria-label="Abrir la galería"
          >
            <Photo
              name={image}
              alt={room.nombre}
              priority
              className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
            />
          </button>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {room.imagenes.map((name, index) => (
              <button
                key={name}
                type="button"
                aria-label={`Ver foto ${index + 1}`}
                aria-pressed={index === active}
                onClick={() => {
                  setActive(index)
                  setOpen(true)
                }}
                className={index === active ? 'opacity-100' : 'opacity-55 hover:opacity-100'}
              >
                <Photo name={name} alt="" className="aspect-[4/3] w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
          <p className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">
            {typeLabel[room.tipo]}
          </p>
          <h1 className="mt-2 font-display text-5xl leading-none font-medium tracking-tight sm:text-6xl">
            {room.nombre}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted">{room.descripcion}</p>
          <dl className="mt-6 grid grid-cols-3 border-y border-line py-4 text-sm">
            <div>
              <dt className="text-muted">Camas</dt>
              <dd className="mt-1 font-mono">{room.camas}</dd>
            </div>
            <div>
              <dt className="text-muted">Cupo</dt>
              <dd className="mt-1 font-mono">{room.maxPersonas}</dd>
            </div>
            <div>
              <dt className="text-muted">Área</dt>
              <dd className="mt-1 font-mono">{room.superficie} m²</dd>
            </div>
          </dl>
          <ul className="mt-6 grid gap-2 text-sm">
            {room.servicios.map((service) => (
              <li key={service} className="border-b border-line py-2 capitalize">
                {service}
              </li>
            ))}
          </ul>
          <p className="mt-6 font-mono text-lg">{formatCop(room.precioNoche)} / noche</p>
          <Link
            to={`/reservar/${room.slug}`}
            className="mt-5 inline-flex h-12 w-full items-center justify-center bg-accent text-sm text-accent-fg"
          >
            Reservar {room.nombre}
          </Link>
        </div>
      </div>
      <Lightbox
        images={room.imagenes}
        alts={room.imagenes.map(() => room.nombre)}
        index={active}
        open={open}
        onOpenChange={setOpen}
        onIndex={setActive}
      />
    </article>
  )
}
