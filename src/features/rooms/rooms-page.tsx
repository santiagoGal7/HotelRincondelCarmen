import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Carousel, Slide } from '@/components/cinematic/carousel'
import { Button } from '@/components/ui/button'
import { Photo } from '@/components/photo'
import { PageIntro, usePageTitle } from '@/components/page-intro'
import { typeLabel } from '@/data/content'
import { formatCop } from '@/lib/format'
import { useHotel } from '@/lib/hotel-context'
import { cn } from '@/lib/cn'
import type { RoomType } from '@/lib/api/types'

const filters: Array<{ id: 'todas' | RoomType; label: string }> = [
  { id: 'todas', label: 'Todas' },
  { id: 'estandar', label: 'Estándar' },
  { id: 'deluxe', label: 'Deluxe' },
  { id: 'suite', label: 'Suite' },
]

export function RoomsPage() {
  usePageTitle('Habitaciones')
  const { rooms } = useHotel()
  const [filter, setFilter] = useState<(typeof filters)[number]['id']>('todas')
  const visible = useMemo(
    () => rooms.filter((room) => filter === 'todas' || room.tipo === filter),
    [rooms, filter],
  )

  return (
    <>
      <PageIntro
        index="Habitaciones"
        title="Tres piezas, tres tarifas."
        lede="El inventario parte de la ficha original: estándar para dos, deluxe con jacuzzi para cuatro y suite para seis. Cada una tiene su propia galería."
      />
      <div className="shell pb-8">
        <Carousel label="Recorrer">
          {rooms.map((room) => (
            <Slide key={room.id}>
              <Link to={`/habitaciones/${room.slug}`} className="group block">
                <div className="overflow-hidden">
                  <Photo
                    name={room.imagenes[0]}
                    alt={room.nombre}
                    className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="mt-3 font-mono text-[11px] tracking-[0.16em] text-muted uppercase">
                  {typeLabel[room.tipo]}
                </p>
                <p className="font-display text-3xl">{room.nombre}</p>
              </Link>
            </Slide>
          ))}
        </Carousel>
      </div>
      <div className="shell flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={filter === item.id}
            onClick={() => setFilter(item.id)}
            className={cn(
              'h-10 border px-4 text-sm',
              filter === item.id ? 'border-fg bg-fg text-bg' : 'border-line',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="shell py-12 md:py-16">
        {visible.length === 0 ? (
          <p className="border-t border-line py-10 text-muted">No hay habitaciones en este tipo.</p>
        ) : (
          <div className="border-b border-line">
            {visible.map((room) => (
              <article
                key={room.id}
                className="grid gap-6 border-t border-line py-8 md:grid-cols-12 md:items-center"
              >
                <Link to={`/habitaciones/${room.slug}`} className="md:col-span-5">
                  <Photo
                    name={room.imagenes[0]}
                    alt={room.nombre}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </Link>
                <div className="md:col-span-7">
                  <p className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">
                    {typeLabel[room.tipo]}
                  </p>
                  <h2 className="mt-2 font-display text-4xl tracking-tight">
                    <Link to={`/habitaciones/${room.slug}`}>{room.nombre}</Link>
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
                    {room.descripcion}
                  </p>
                  <p className="mt-4 font-mono text-sm">
                    {room.camas} {room.camas === 1 ? 'cama' : 'camas'} · hasta {room.maxPersonas} ·{' '}
                    {room.superficie} m²
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <p className="font-mono">{formatCop(room.precioNoche)} / noche</p>
                    <Button asChild variant="primary" size="sm" arrow>
                      <Link to={`/reservar/${room.slug}`}>Reservar esta</Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
