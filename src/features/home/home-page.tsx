import * as Accordion from '@radix-ui/react-accordion'
import { Minus, Plus } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { lazy, Suspense, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Carousel, Slide } from '@/components/cinematic/carousel'
import { Button } from '@/components/ui/button'
import { Counter } from '@/components/cinematic/counter'
import { MaskImage } from '@/components/cinematic/mask-image'
import { SplitText } from '@/components/cinematic/split-text'
import { Photo } from '@/components/photo'
import { usePageTitle } from '@/components/page-intro'
import { amenities, faq, services, testimonials } from '@/data/content'
import { useHotel } from '@/lib/hotel-context'

const marquee = ['Estándar', 'Deluxe', 'Suite', 'Spa', 'Cocina', 'Piscina', 'Valle de Apicalá']

const RoomStory = lazy(() =>
  import('@/components/cinematic/story').then((module) => ({ default: module.RoomStory })),
)
const ImageReel = lazy(() =>
  import('@/components/cinematic/reel').then((module) => ({ default: module.ImageReel })),
)

const places = [
  {
    id: 'hotel',
    label: 'El hotel',
    detail: 'Carrera 10 #25-30, Carmen de Apicalá.',
    src: 'https://www.openstreetmap.org/export/embed.html?bbox=-74.755%2C4.132%2C-74.715%2C4.162&layer=mapnik&marker=4.147%2C-74.735',
  },
  {
    id: 'melgar',
    label: 'Melgar',
    detail: 'Unos quince minutos por la vía del valle.',
    src: 'https://www.openstreetmap.org/export/embed.html?bbox=-74.82%2C4.08%2C-74.55%2C4.28&layer=mapnik&marker=4.204%2C-74.641',
  },
  {
    id: 'bogota',
    label: 'Bogotá',
    detail: 'Unas dos horas y media por Soacha.',
    src: 'https://www.openstreetmap.org/export/embed.html?bbox=-74.9%2C4.0%2C-73.9%2C4.9&layer=mapnik&marker=4.147%2C-74.735',
  },
]

function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.15])

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <img
          src="/media/hero-poster-800.avif"
          srcSet="/media/hero-poster-800.avif 800w, /media/hero-poster.avif 1920w"
          sizes="100vw"
          alt=""
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {reduce ? null : (
          <motion.video
            style={{ y, scale: 1.08 }}
            className="absolute inset-0 h-full w-full object-cover"
            muted
            loop
            playsInline
            preload="none"
            ref={(node) => {
              if (!node || node.dataset.armed) return
              node.dataset.armed = '1'
              const start = () => {
                node.play().catch(() => undefined)
              }
              const idle = window.requestIdleCallback?.bind(window)
              if (idle) idle(start)
              else window.setTimeout(start, 700)
            }}
          >
            <source src="/media/hero.mp4" type="video/mp4" />
            <source src="/media/hero.webm" type="video/webm" />
          </motion.video>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/40" />
      </div>
      <motion.div
        style={reduce ? undefined : { opacity }}
        className="relative flex min-h-[100svh] flex-col justify-end pb-16"
      >
        <div className="shell">
          <motion.p
            className="font-mono text-[11px] tracking-[0.22em] uppercase"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            Carmen de Apicalá · Tolima
          </motion.p>
          <h1 className="type-display mt-4 max-w-5xl">
            <SplitText text="El rincón del Carmen" />
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            Tres habitaciones en el pueblo. Desayuno en la casa, piscina al mediodía y un spa que funciona con cita.
          </p>
          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            <Button asChild variant="primary" size="lg" arrow magnetic>
              <Link to="/reservar">Reservar estancia</Link>
            </Button>
            <Button asChild variant="secondary" inverse size="lg" arrow>
              <a href="#historia">Bajar por la casa</a>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

export function HomePage() {
  usePageTitle('Inicio')
  const { rooms } = useHotel()
  const ordered = [...rooms].sort((a, b) => a.precioNoche - b.precioNoche)
  const [place, setPlace] = useState(places[0])

  return (
    <>
      <Hero />
      <div className="overflow-hidden border-b border-line py-4">
        <div className="marquee-track flex w-max gap-8 pr-8 font-mono text-[11px] tracking-[0.18em] uppercase">
          {[...marquee, ...marquee].map((item, index) => (
            <span key={`${item}-${index}`} className="flex items-center gap-8">
              {item}
              <span className="h-1.5 w-1.5 bg-accent" aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>

      <section id="historia" className="grid items-center md:grid-cols-12">
        <div className="shell py-20 md:col-span-5 md:py-28 lg:py-32">
          <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">01 — La casa</p>
          <SplitText
            as="h2"
            text="Una casa con tres llaves, no un complejo."
            className="mt-4 font-display text-4xl leading-[0.95] font-medium tracking-tight text-balance sm:text-6xl"
          />
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
            Está en el casco de Carmen de Apicalá, sobre la vía que baja hacia Melgar. Recepción de día y de noche, patio con piscina y cocina para el desayuno.
          </p>
        </div>
        <MaskImage className="md:col-span-7">
          <Photo
            name="facade"
            alt="Fachada de un hotel al atardecer"
            className="h-[420px] w-full object-cover md:h-[640px]"
          />
        </MaskImage>
      </section>

      <Suspense fallback={<div className="h-screen bg-[#0c0b0a]" />}>
        <RoomStory rooms={ordered} />
      </Suspense>
      <Suspense fallback={null}>
        <ImageReel />
      </Suspense>

      <section id="servicios" className="shell py-20 md:py-28">
        <Carousel label="02 — Experiencias">
          {services.map((service) => (
            <Slide key={service.id}>
              <article className="group relative h-[460px] overflow-hidden">
                <Photo
                  name={service.image}
                  alt={service.alt}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="font-mono text-[11px] tracking-[0.16em] uppercase">{service.kicker}</p>
                  <h3 className="mt-2 font-display text-4xl">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/85">{service.text}</p>
                  <p className="mt-3 font-mono text-xs">{service.hours}</p>
                </div>
              </article>
            </Slide>
          ))}
          <Slide>
            <article className="group relative h-[460px] overflow-hidden">
              <Photo name="breakfast" alt="Mesa de desayuno" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="font-mono text-[11px] tracking-[0.16em] uppercase">Incluido</p>
                <h3 className="mt-2 font-display text-4xl">Desayuno</h3>
                <p className="mt-2 text-sm text-white/85">Sale de la cocina de la casa, entre las 7:30 y las 10:00.</p>
              </div>
            </article>
          </Slide>
        </Carousel>
      </section>

      <section className="shell pb-20 md:pb-28">
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">03 — La casa en cifras</p>
        <div className="mt-8 grid border-y border-line sm:grid-cols-2 lg:grid-cols-4">
          {[
            [3, '', 'Habitaciones'],
            [15, ':00', 'Entrada'],
            [12, ':00', 'Salida'],
            [15, ' min', 'Desde Melgar'],
          ].map(([value, suffix, label]) => (
            <div key={String(label)} className="border-b border-line px-1 py-8 sm:border-b-0 sm:px-6 lg:border-l lg:first:border-l-0">
              <p className="font-display text-5xl tracking-tight">
                <Counter value={Number(value)} suffix={String(suffix)} />
              </p>
              <p className="mt-2 text-sm text-muted">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="shell pb-20 md:pb-28">
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">04 — En la casa</p>
        <h2 className="mt-3 max-w-3xl font-display text-4xl leading-tight font-medium tracking-tight sm:text-6xl">
          Lo que está incluido, puesto en su sitio.
        </h2>
        <div className="mt-8 grid gap-3 md:grid-cols-12">
          <article className="relative min-h-[460px] overflow-hidden md:col-span-7 md:row-span-2">
            <Photo name="resort" alt="Piscina entre palmeras" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <h3 className="font-display text-4xl">Piscina</h3>
              <p className="mt-2 max-w-sm text-sm text-white/85">Abierta de 8:00 a 19:00. La toalla se pide en recepción.</p>
            </div>
          </article>
          <article className="relative min-h-[224px] overflow-hidden md:col-span-5">
            <Photo name="spa-hands" alt="Tratamiento de spa" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <p className="absolute bottom-5 left-5 font-display text-3xl text-white">Spa con cita</p>
          </article>
          <article className="relative min-h-[224px] overflow-hidden md:col-span-5">
            <Photo name="cocktail" alt="Copa en el comedor" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <p className="absolute bottom-5 left-5 font-display text-3xl text-white">Cocina</p>
          </article>
          {amenities.slice(0, 4).map(([name, detail]) => (
            <article key={name} className="border border-line p-5 md:col-span-3">
              <h3 className="font-display text-2xl">{name}</h3>
              <p className="mt-2 text-sm text-muted">{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-line">
        <div className="shell py-20 md:py-28">
          <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">05 — Voces de ejemplo</p>
          <div className="mt-8">
            <Carousel label="Notas de la demostración">
              {testimonials.map((item) => (
                <Slide key={item.name}>
                  <figure className="flex h-full min-h-[280px] flex-col justify-between border border-line p-6">
                    <blockquote className="font-display text-2xl leading-snug italic sm:text-3xl">“{item.quote}”</blockquote>
                    <figcaption className="mt-6 text-sm">
                      <span className="block">{item.name}</span>
                      <span className="text-muted">{item.detail}</span>
                    </figcaption>
                  </figure>
                </Slide>
              ))}
            </Carousel>
          </div>
        </div>
      </section>

      <section id="ubicacion" className="grid lg:grid-cols-2">
        <div className="shell py-16 lg:py-24">
          <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">06 — Llegar</p>
          <h2 className="mt-3 font-display text-4xl leading-tight font-medium sm:text-5xl">
            Carmen de Apicalá, a un lado de Melgar.
          </h2>
          <div className="mt-8 grid gap-2" role="tablist" aria-label="Distancias">
            {places.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={place.id === item.id}
                onClick={() => setPlace(item)}
                className={`border px-4 py-4 text-left ${place.id === item.id ? 'border-fg bg-elev' : 'border-line'}`}
              >
                <span className="block font-display text-2xl">{item.label}</span>
                <span className="mt-1 block text-sm text-muted">{item.detail}</span>
              </button>
            ))}
          </div>
          <p className="mt-6 text-sm">
            <a className="underline underline-offset-4" href="tel:+571234567890">+57 123 456 7890</a>
            <span className="mx-2 text-muted">·</span>
            <a className="underline underline-offset-4" href="mailto:info@rincondelcarmen.com">info@rincondelcarmen.com</a>
          </p>
        </div>
        <iframe
          title={`Mapa: ${place.label}`}
          className="min-h-[420px] w-full grayscale"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={place.src}
        />
      </section>

      <section className="shell py-20 md:py-28">
        <h2 className="font-display text-4xl font-medium sm:text-5xl">Preguntas de recepción.</h2>
        <Accordion.Root type="single" collapsible className="mt-8 border-t border-line">
          {faq.map((item) => (
            <Accordion.Item key={item.q} value={item.q} className="border-b border-line">
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 py-5 text-left font-display text-2xl">
                  {item.q}
                  <Plus size={18} className="shrink-0 group-data-[state=open]:hidden" />
                  <Minus size={18} className="hidden shrink-0 group-data-[state=open]:block" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="max-w-3xl pb-5 text-sm leading-relaxed text-muted">{item.a}</Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </section>
    </>
  )
}
