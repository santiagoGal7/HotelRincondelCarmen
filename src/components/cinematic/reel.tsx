import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { Photo } from '@/components/photo'
import '@/lib/scroll'

const frames = [
  ['corridor', 'Corredor de la casa'],
  ['linen', 'Ropa de cama'],
  ['breakfast', 'Desayuno'],
  ['cocktail', 'La mesa'],
  ['resort', 'La piscina'],
  ['facade', 'La fachada'],
] as const

export function ImageReel() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const node = root.current
    if (!node) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const wide = window.matchMedia('(min-width: 768px)').matches
    if (reduce || !wide) return
    const ctx = gsap.context(() => {
      const track = node.querySelector('[data-reel]')
      if (!track) return
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth + 48),
        ease: 'none',
        scrollTrigger: {
          trigger: node,
          start: 'top top',
          end: () => `+=${track.scrollWidth}`,
          pin: true,
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      })
    }, node)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="overflow-hidden bg-bg">
      <div data-reel className="flex gap-4 px-5 py-16 md:h-screen md:w-max md:items-center md:px-10 md:py-0">
        <div className="flex w-[70vw] shrink-0 flex-col justify-center pr-6 md:w-[34vw]">
          <p className="type-kicker text-muted">La casa, de lado</p>
          <h2 className="type-h2 mt-3 max-w-sm">Seis encuadres. Ninguno es un folleto.</h2>
        </div>
        {frames.map(([name, alt]) => (
          <figure key={name} className="group relative h-[68vw] w-[78vw] shrink-0 overflow-hidden md:h-[72vh] md:w-[46vw]">
            <Photo
              name={name}
              alt={alt}
              sizes="(max-width: 768px) 80vw, 46vw"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <figcaption className="pointer-events-none absolute bottom-4 left-4 font-display text-2xl text-white">
              {alt}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
