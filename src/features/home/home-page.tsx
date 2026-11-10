import * as Accordion from '@radix-ui/react-accordion'
import { Minus, Plus } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Photo } from '@/components/photo'
import { Reveal } from '@/components/motion/reveal'
import { usePageTitle } from '@/components/page-intro'
import { amenities, faq, services, testimonials, typeLabel } from '@/data/content'
import { formatCop } from '@/lib/format'
import { useHotel } from '@/lib/hotel-context'

const marquee = ['Estándar', 'Deluxe', 'Suite', 'Spa', 'Cocina', 'Piscina', 'Valle de Apicalá']

function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const copy = useTransform(scrollYProgress, [0, 0.7], [1, 0.2])

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden bg-black text-white">
      <div className="absolute inset-0" aria-hidden="true">
        {reduce ? (
          <Photo name="hero-poster" alt="" priority className="h-full w-full object-cover" />
        ) : (
          <motion.video
            style={{ y }}
            className="h-[112%] w-full object-cover"
            poster="/media/hero-poster.webp"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src="/media/hero.mp4" type="video/mp4" />
            <source src="/media/hero.webm" type="video/webm" />
          </motion.video>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/35" />
      </div>
      <motion.div
        style={reduce ? undefined : { opacity: copy }}
        className="relative flex min-h-[100svh] flex-col justify-end px-5 pt-28 pb-10 sm:px-8 sm:pb-14"
      >
        <div className="mx-auto w-full max-w-[1240px]">
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase">
            Carmen de Apicalá · Tolima
          </p>
          <h1 className="mt-4 max-w-5xl font-display text-[clamp(3.4rem,11vw,8.4rem)] leading-[0.86] font-semibold tracking-[-0.045em] text-balance">
            El rincón
            <br />
            del Carmen
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            Tres habitaciones en el pueblo. Desayuno en la casa, piscina al mediodía y un spa que
            funciona con cita.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/reservar"
              className="inline-flex h-12 items-center justify-center bg-accent px-5 text-sm text-accent-fg"
            >
              Reservar estancia
            </Link>
            <Link
              to="/habitaciones"
              className="inline-flex h-12 items-center justify-center border border-white/40 px-5 text-sm"
            >
              Ver las tres habitaciones
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export function HomePage() {
  usePageTitle('Inicio')
  const { rooms } = useHotel()
  const ordered = [...rooms].sort((a, b) => a.precioNoche - b.precioNoche)
  const [quote, setQuote] = useState(0)
  const current = testimonials[quote]

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

      <section className="grid md:grid-cols-12">
        <div className="px-5 py-16 sm:px-8 md:col-span-5 md:py-24">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
              01 — La casa
            </p>
            <h2 className="mt-4 font-display text-4xl tracking-tight text-balance sm:text-6xl">
              Una casa con tres llaves, no un complejo.
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
              Está en el casco de Carmen de Apicalá, sobre la vía que baja hacia Melgar. Recepción
              de día y de noche, patio con piscina y cocina para el desayuno. Nada de ala ejecutiva.
            </p>
            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-6">
              {[
                ['03', 'Habitaciones'],
                ['15:00', 'Entrada'],
                ['12:00', 'Salida'],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="font-display text-2xl tracking-tight sm:text-3xl">{value}</dt>
                  <dd className="mt-1 text-xs text-muted">{label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
        <div className="min-h-[420px] md:col-span-7">
          <Photo
            name="night"
            alt="Tumbonas frente a un valle al atardecer"
            className="h-full min-h-[420px] w-full object-cover"
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-5 py-20 sm:px-8" id="habitaciones">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
              02 — Habitaciones
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-6xl">
              Estándar, deluxe y suite.
            </h2>
          </div>
          <Link to="/habitaciones" className="text-sm underline underline-offset-4">
            Ver ficha y fotos
          </Link>
        </div>
        <div className="mt-10 border-b border-line">
          {ordered.map((room, index) => (
            <Link
              key={room.id}
              to={`/habitaciones/${room.slug}`}
              className="grid gap-5 border-t border-line py-7 md:grid-cols-12 md:items-center"
            >
              <span className="font-mono text-xs text-muted md:col-span-1">0{index + 1}</span>
              <div className="md:col-span-4">
                <p className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">
                  {typeLabel[room.tipo]}
                </p>
                <h3 className="mt-1 font-display text-3xl tracking-tight">{room.nombre}</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted md:col-span-4">{room.resumen}</p>
              <p className="font-mono text-sm md:col-span-3 md:text-right">
                {formatCop(room.precioNoche)}
                <span className="text-muted"> / noche</span>
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section id="servicios" className="mx-auto w-full max-w-[1240px] px-5 pb-20 sm:px-8">
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
          03 — Servicios
        </p>
        <h2 className="mt-3 max-w-3xl font-display text-4xl tracking-tight text-balance sm:text-6xl">
          Spa, cocina y piscina. Cada uno con su horario.
        </h2>
        <div className="mt-10 grid gap-3 md:grid-cols-12">
          {services.map((service, index) => (
            <article
              key={service.id}
              className={
                index === 0
                  ? 'relative min-h-[460px] md:col-span-7 md:row-span-2'
                  : 'relative min-h-[240px] md:col-span-5'
              }
            >
              <Photo
                name={service.image}
                alt={service.alt}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                <p className="font-mono text-[11px] tracking-[0.16em] uppercase">
                  {service.kicker}
                </p>
                <h3 className="mt-2 font-display text-4xl tracking-tight">{service.title}</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-white/85">
                  {service.text}
                </p>
                <p className="mt-3 font-mono text-xs">{service.hours}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-line">
        <div className="mx-auto grid w-full max-w-[1240px] gap-10 px-5 py-16 sm:px-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
              04 — En la casa
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-tight">Lo que está incluido.</h2>
          </div>
          <dl className="grid gap-x-8 sm:grid-cols-2 md:col-span-8">
            {amenities.map(([name, detail]) => (
              <div
                key={name}
                className="grid grid-cols-[8rem_1fr] gap-3 border-t border-line py-4 text-sm"
              >
                <dt>{name}</dt>
                <dd className="text-muted">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-5 py-20 sm:px-8">
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
          05 — Voces de ejemplo
        </p>
        <figure className="mt-6 max-w-4xl">
          <blockquote className="font-display text-3xl leading-tight tracking-tight text-balance sm:text-5xl">
            “{current.quote}”
          </blockquote>
          <figcaption className="mt-6 text-sm">
            <span className="block">{current.name}</span>
            <span className="text-muted">{current.detail}</span>
          </figcaption>
        </figure>
        <div className="mt-8 flex gap-3">
          {testimonials.map((item, index) => (
            <button
              key={item.name}
              type="button"
              aria-label={`Mostrar nota de ${item.name}`}
              aria-pressed={quote === index}
              onClick={() => setQuote(index)}
              className={quote === index ? 'h-2 w-8 bg-fg' : 'h-2 w-8 bg-line'}
            />
          ))}
        </div>
      </section>

      <section id="ubicacion" className="grid border-t border-line md:grid-cols-2">
        <div className="px-5 py-16 sm:px-8">
          <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
            06 — Llegar
          </p>
          <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
            Carmen de Apicalá, a un lado de Melgar.
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-muted">
            Carrera 10 #25-30. Desde Melgar son unos quince minutos. Desde Bogotá, unas dos horas y
            media por Soacha.
          </p>
          <dl className="mt-8 grid gap-3 text-sm">
            <div>
              <dt className="text-muted">Teléfono</dt>
              <dd>
                <a href="tel:+571234567890">+57 123 456 7890</a>
              </dd>
            </div>
            <div>
              <dt className="text-muted">Correo</dt>
              <dd>
                <a href="mailto:info@rincondelcarmen.com">info@rincondelcarmen.com</a>
              </dd>
            </div>
          </dl>
          <Link to="/contacto" className="mt-8 inline-flex text-sm underline underline-offset-4">
            Escribir a la casa
          </Link>
        </div>
        <iframe
          title="Mapa de Carmen de Apicalá"
          className="min-h-[360px] w-full grayscale"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.openstreetmap.org/export/embed.html?bbox=-74.755%2C4.132%2C-74.715%2C4.162&layer=mapnik&marker=4.147%2C-74.735"
        />
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-5 py-20 sm:px-8">
        <h2 className="font-display text-4xl tracking-tight sm:text-5xl">
          Preguntas de recepción.
        </h2>
        <Accordion.Root type="single" collapsible className="mt-8 border-t border-line">
          {faq.map((item) => (
            <Accordion.Item key={item.q} value={item.q} className="border-b border-line">
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 py-5 text-left font-display text-xl sm:text-2xl">
                  {item.q}
                  <Plus size={18} className="shrink-0 group-data-[state=open]:hidden" />
                  <Minus size={18} className="hidden shrink-0 group-data-[state=open]:block" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="max-w-3xl pb-5 text-sm leading-relaxed text-muted">
                {item.a}
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col items-start justify-between gap-6 px-5 py-16 sm:px-8 md:flex-row md:items-end">
          <h2 className="max-w-xl font-display text-4xl tracking-tight text-balance sm:text-6xl">
            La llegada se confirma aquí. El pago, en la casa.
          </h2>
          <Link
            to="/reservar"
            className="inline-flex h-12 items-center bg-accent px-5 text-sm text-accent-fg"
          >
            Armar la reserva
          </Link>
        </div>
      </section>
    </>
  )
}
