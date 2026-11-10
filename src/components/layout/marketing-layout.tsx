import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { Outlet, useLocation } from 'react-router-dom'
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
      <ScrollProgress />
      <SiteHeader />
      <div className="pointer-events-none fixed inset-y-0 left-0 z-30 hidden w-10 xl:block">
        <p
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 font-mono text-[10px] tracking-[0.22em] whitespace-nowrap ${pathname === '/' ? 'text-white/75' : 'text-muted'}`}
        >
          El Rincón · Carmen de Apicalá
        </p>
      </div>
      {error ? (
        <p
          className="mx-auto mt-24 w-full max-w-[1240px] px-5 text-sm text-accent sm:px-8"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      <main id="contenido">
        <Outlet />
      </main>
      <SiteFooter />
    </>
  )
}
