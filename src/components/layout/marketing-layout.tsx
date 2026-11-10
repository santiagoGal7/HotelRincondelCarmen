import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { useLocation } from 'react-router-dom'
import { IntroLoader } from '@/components/cinematic/loader'
import { StickyBook } from '@/components/cinematic/sticky-book'
import { PageTransition } from '@/components/layout/page-transition'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { useHotel } from '@/lib/hotel-context'

function ScrollProgress() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  if (reduce) return null
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-px origin-left bg-fg"
    />
  )
}

export function MarketingLayout() {
  const { error } = useHotel()
  const { pathname } = useLocation()
  return (
    <>
      <IntroLoader />
      <ScrollProgress />
      <SiteHeader />
      <StickyBook />
      <div className="pointer-events-none fixed inset-y-0 left-0 z-30 hidden w-10 min-[1680px]:block">
        <p
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 font-mono text-[10px] tracking-[0.22em] whitespace-nowrap ${pathname === '/' ? 'text-white/75' : 'text-muted'}`}
        >
          El Rincón · Carmen de Apicalá
        </p>
      </div>
      {error ? (
        <p
          className="shell mt-24 text-sm text-accent"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      <main id="contenido">
        <PageTransition />
      </main>
      <SiteFooter />
    </>
  )
}
