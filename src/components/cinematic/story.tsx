import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Photo } from '@/components/photo'
import { typeLabel } from '@/data/content'
import { formatCop } from '@/lib/format'
import type { Room } from '@/lib/api/types'
import '@/lib/scroll'

export function RoomStory({ rooms }: { rooms: Room[] }) {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const node = root.current
    if (!node || rooms.length < 2) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const wide = window.matchMedia('(min-width: 768px)').matches
    if (reduce || !wide) return

    const ctx = gsap.context(() => {
      const track = node.querySelector('[data-track]')
      if (!track) return
      gsap.to(track, {
        x: () => -window.innerWidth * (rooms.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: node,
          start: 'top top',
          end: `+=${rooms.length * 100}%`,
          pin: true,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
    }, node)

    return () => ctx.revert()
  }, [rooms])

  return (
    <section ref={root} className="relative overflow-hidden bg-[#0c0b0a] text-[#f4efe6]" id="habitaciones">
      <div data-track className="flex flex-col md:h-screen md:w-max md:flex-row">
        {rooms.map((room, index) => (
          <article key={room.id} className="grid min-h-[88vh] md:h-screen md:w-screen md:grid-cols-2">
            <div className="relative min-h-[42vh] overflow-hidden md:min-h-0">
              <Photo name={room.imagenes[0]} alt={room.nombre} className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col justify-center px-6 py-12 sm:px-12 md:px-16">
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase">
                0{index + 1} — {typeLabel[room.tipo]}
              </p>
              <h3 className="mt-4 font-display text-5xl leading-[0.9] font-medium sm:text-7xl">{room.nombre}</h3>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-[#c3b8a8]">{room.resumen}</p>
              <p className="mt-6 font-mono text-sm">
                {formatCop(room.precioNoche)} <span className="text-[#c3b8a8]">/ noche</span>
              </p>
              <Link
                to={`/habitaciones/${room.slug}`}
                className="mt-8 inline-flex h-11 w-fit items-center border border-white/30 px-4 text-sm hover:bg-white hover:text-[#0c0b0a]"
              >
                Ver la habitación
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
